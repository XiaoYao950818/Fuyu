use windows::Win32::{
    Foundation::HWND,
    System::Com::{CoCreateInstance, CLSCTX_INPROC_SERVER},
    UI::{
        Shell::{ITaskbarList, TaskbarList},
        WindowsAndMessaging::{ShowWindow, SW_HIDE, SW_SHOW},
    },
};

use super::com::ComApartment;
use super::window;

const TRAY_CLASSES: [&str; 2] = ["Shell_TrayWnd", "Shell_SecondaryTrayWnd"];

pub(crate) fn is_tray_window(class: &str) -> bool {
    TRAY_CLASSES.contains(&class)
}

fn set_tray_windows(show: bool) -> bool {
    let mut changed = false;
    let _ = window::for_each_top_level_window(|handle| {
        if !is_tray_window(&window::class_name(handle)) {
            return;
        }
        changed = unsafe { ShowWindow(handle, if show { SW_SHOW } else { SW_HIDE }) }.as_bool()
            || changed;
    });
    changed
}

pub(crate) fn hide_taskbar() -> bool {
    set_tray_windows(false)
}

pub(crate) fn show_taskbar() -> bool {
    set_tray_windows(true)
}

pub(crate) fn set_button(window: HWND, shown: bool) -> bool {
    if window.is_invalid() {
        return false;
    }
    let _com = ComApartment::multithreaded().ok();
    let done = unsafe {
        CoCreateInstance::<_, ITaskbarList>(&TaskbarList, None, CLSCTX_INPROC_SERVER).and_then(
            |list| {
                list.HrInit()?;
                if shown {
                    list.AddTab(window)
                } else {
                    list.DeleteTab(window)
                }
            },
        )
    };
    done.is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_the_main_and_secondary_tray_classes_are_taskbars() {
        assert!(is_tray_window("Shell_TrayWnd"));
        assert!(is_tray_window("Shell_SecondaryTrayWnd"));
        assert!(!is_tray_window("Shell_TrayWnd2"));
        assert!(!is_tray_window("shell_traywnd"));
        assert!(!is_tray_window(""));
        assert!(!is_tray_window("Progman"));
    }
}
