use std::{
    sync::{Mutex, PoisonError},
    thread,
    time::Duration,
};
use tauri::AppHandle;

use super::{
    screens,
    window::{apply_placement, current_placement, dock_window, target_placement, DockPlacement},
};

const POLL_INTERVAL: Duration = Duration::from_millis(500);
const SETTLE_POLLS: u32 = 2;

static STARTED: Mutex<bool> = Mutex::new(false);

pub(crate) fn start(app: AppHandle) {
    let mut started = STARTED.lock().unwrap_or_else(PoisonError::into_inner);
    if *started {
        return;
    }
    *started = true;
    thread::spawn(move || {
        let mut pending: Option<(DockPlacement, u32)> = None;
        loop {
            thread::sleep(POLL_INTERVAL);
            let Some(placement) = target_placement(&app, screens::read_screen()) else {
                pending = None;
                continue;
            };
            let Some(window) = dock_window(&app) else {
                pending = None;
                continue;
            };
            if !window.is_visible().unwrap_or(false) {
                pending = None;
                continue;
            }
            if current_placement(&window).is_some_and(|current| current == placement) {
                pending = None;
                continue;
            }
            let seen = polls_on(pending, placement);
            pending = Some((placement, seen));
            if seen < SETTLE_POLLS {
                continue;
            }
            pending = None;
            apply_placement(&window, placement);
        }
    });
}

fn polls_on(pending: Option<(DockPlacement, u32)>, placement: DockPlacement) -> u32 {
    match pending {
        Some((known, polls)) if known == placement => polls + 1,
        _ => 1,
    }
}

#[cfg(test)]
mod tests {
    use super::{polls_on, DockPlacement};

    const PRIMARY: DockPlacement = DockPlacement {
        x: 580,
        y: 996,
        width: 760,
        height: 76,
    };
    const SECONDARY: DockPlacement = DockPlacement {
        x: 2500,
        y: 1356,
        width: 760,
        height: 76,
    };

    #[test]
    fn a_placement_counts_only_while_it_stays_put() {
        assert_eq!(polls_on(None, SECONDARY), 1);
        assert_eq!(polls_on(Some((SECONDARY, 1)), SECONDARY), 2);
        assert_eq!(polls_on(Some((PRIMARY, 3)), SECONDARY), 1);
    }

    #[test]
    fn the_same_spot_on_another_screen_is_a_different_placement() {
        assert_ne!(PRIMARY, SECONDARY);
        assert_eq!(
            PRIMARY,
            DockPlacement {
                x: 580,
                y: 996,
                width: 760,
                height: 76
            }
        );
    }
}
