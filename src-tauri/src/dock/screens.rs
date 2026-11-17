use std::sync::{Mutex, PoisonError};

use tauri::{AppHandle, Manager, Monitor};

use crate::win32::window;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum DockScreen {
    Primary,
    Cursor,
}

impl DockScreen {
    pub(crate) fn from_value(value: &str) -> Option<Self> {
        match value {
            "primary" => Some(Self::Primary),
            "cursor" => Some(Self::Cursor),
            _ => None,
        }
    }
}

static SCREEN: Mutex<DockScreen> = Mutex::new(DockScreen::Primary);

pub(crate) fn set_screen(screen: DockScreen) {
    let mut current = SCREEN.lock().unwrap_or_else(PoisonError::into_inner);
    *current = screen;
}

pub(crate) fn read_screen() -> DockScreen {
    *SCREEN.lock().unwrap_or_else(PoisonError::into_inner)
}

pub(crate) fn contains(
    (left, top, width, height): (i32, i32, u32, u32),
    (x, y): (i32, i32),
) -> bool {
    x >= left && x < left + width as i32 && y >= top && y < top + height as i32
}

fn monitor_at(monitors: &[Monitor], point: (i32, i32)) -> Option<&Monitor> {
    monitors.iter().find(|monitor| {
        let origin = monitor.position();
        let size = monitor.size();
        contains((origin.x, origin.y, size.width, size.height), point)
    })
}

fn first_available(app: &AppHandle) -> Option<Monitor> {
    app.available_monitors()
        .ok()
        .and_then(|monitors| monitors.into_iter().next())
}

pub(crate) fn target_monitor(app: &AppHandle, screen: DockScreen) -> Option<Monitor> {
    match screen {
        DockScreen::Primary => app
            .primary_monitor()
            .ok()
            .flatten()
            .or_else(|| first_available(app)),
        DockScreen::Cursor => {
            let point = window::cursor_position().map(|point| (point.x, point.y));
            let monitors = app.available_monitors().ok().unwrap_or_default();
            let on_cursor = point.and_then(|point| monitor_at(&monitors, point).cloned());
            on_cursor
                .or_else(|| app.primary_monitor().ok().flatten())
                .or_else(|| monitors.into_iter().next())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_primary_and_cursor_are_screens() {
        assert_eq!(DockScreen::from_value("primary"), Some(DockScreen::Primary));
        assert_eq!(DockScreen::from_value("cursor"), Some(DockScreen::Cursor));
        assert_eq!(DockScreen::from_value("foreground"), None);
        assert_eq!(DockScreen::from_value(""), None);
        assert_eq!(DockScreen::from_value("Primary"), None);
    }

    #[test]
    fn a_point_on_the_edge_belongs_to_one_screen_only() {
        let left = (0, 0, 1920, 1080);
        let right = (1920, 0, 2560, 1440);
        assert!(contains(left, (0, 0)));
        assert!(contains(left, (1919, 1079)));
        assert!(!contains(left, (1920, 0)));
        assert!(contains(right, (1920, 0)));
        assert!(!contains(right, (1920 + 2560, 0)));
        assert!(!contains(left, (-1, 500)));
        assert!(!contains(left, (500, 1080)));
    }

    #[test]
    fn the_screen_setting_starts_on_primary_and_keeps_the_last_choice() {
        assert_eq!(read_screen(), DockScreen::Primary);
        set_screen(DockScreen::Cursor);
        assert_eq!(read_screen(), DockScreen::Cursor);
        set_screen(DockScreen::Primary);
        assert_eq!(read_screen(), DockScreen::Primary);
    }
}
