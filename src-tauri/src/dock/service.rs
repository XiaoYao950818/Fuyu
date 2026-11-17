use std::collections::HashMap;

use windows::Win32::{Foundation::HWND, UI::WindowsAndMessaging::GetWindowThreadProcessId};

use super::{unavailable, DockApp, DockAppList};
use crate::agent_status::host_icon;
use crate::win32::{process, window};

fn process_id(window: HWND) -> u32 {
    let mut id = 0u32;
    unsafe { GetWindowThreadProcessId(window, Some(&mut id)) };
    id
}

fn own_process() -> u32 {
    std::process::id()
}

pub(crate) fn list_apps() -> DockAppList {
    let foreground = window::foreground_window();
    let mut by_exe: HashMap<String, DockApp> = HashMap::new();
    let mut order: Vec<String> = Vec::new();
    let enumerated = window::for_each_top_level_window(|handle| {
        if !window::is_visible(handle) || window::has_owner(handle) {
            return;
        }
        let title = window::window_text(handle, 512);
        if title.trim().is_empty() {
            return;
        }
        let id = process_id(handle);
        if id == 0 || id == own_process() {
            return;
        }
        let path = match process::image_path(id) {
            Some(path) => path,
            None => return,
        };
        let key = path.to_lowercase();
        if by_exe.contains_key(&key) {
            return;
        }
        let icon = host_icon::icon_data_url(&path);
        by_exe.insert(
            key.clone(),
            DockApp {
                window_handle: handle.0 as u64,
                title,
                exe_path: Some(path),
                icon,
                minimized: window::is_minimized(handle),
                active: handle == foreground,
            },
        );
        order.push(key);
    });
    if enumerated.is_err() {
        return unavailable();
    }
    let apps = order
        .into_iter()
        .filter_map(|key| by_exe.remove(&key))
        .collect();
    DockAppList {
        available: true,
        apps,
    }
}

pub(crate) fn activate(window_handle: u64) -> bool {
    let handle = HWND(window_handle as isize);
    if handle.is_invalid() || !window::is_visible(handle) {
        return false;
    }
    window::restore_minimized(handle);
    window::activate_from_background(handle)
}
