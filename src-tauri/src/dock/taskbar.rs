use std::sync::{
    atomic::{AtomicBool, Ordering},
    Mutex, PoisonError,
};
use std::thread;
use std::time::Duration;

use crate::win32::taskbar;

const WATCH_INTERVAL: Duration = Duration::from_secs(2);

static ENABLED: AtomicBool = AtomicBool::new(false);
static STARTED: Mutex<bool> = Mutex::new(false);

fn start_watchdog() {
    let mut started = STARTED.lock().unwrap_or_else(PoisonError::into_inner);
    if *started {
        return;
    }
    *started = true;
    thread::spawn(|| {
        while ENABLED.load(Ordering::SeqCst) {
            taskbar::hide_taskbar();
            thread::sleep(WATCH_INTERVAL);
        }
        taskbar::show_taskbar();
        let mut started = STARTED.lock().unwrap_or_else(PoisonError::into_inner);
        *started = false;
    });
}

pub(crate) fn set_enabled(enabled: bool) {
    if enabled {
        ENABLED.store(true, Ordering::SeqCst);
        taskbar::hide_taskbar();
        start_watchdog();
    } else {
        ENABLED.store(false, Ordering::SeqCst);
        taskbar::show_taskbar();
    }
}
