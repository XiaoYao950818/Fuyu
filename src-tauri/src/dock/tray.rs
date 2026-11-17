use std::path::Path;

use super::{DockApp, TrayIcon, TrayIconList};
use crate::agent_status::host_icon;
use crate::win32::tray_icons;

fn stem(path: &str) -> String {
    Path::new(path)
        .file_stem()
        .map(|stem| stem.to_string_lossy().into_owned())
        .unwrap_or_default()
}

fn matches(app: &DockApp, name: &str) -> bool {
    let name = name.to_lowercase();
    if name.is_empty() {
        return false;
    }
    let title = app.title.to_lowercase();
    if !title.is_empty() && (title.contains(&name) || name.contains(&title)) {
        return true;
    }
    let Some(path) = app.exe_path.as_deref() else {
        return false;
    };
    let stem = stem(path).to_lowercase();
    !stem.is_empty() && (stem.contains(&name) || name.contains(&stem))
}

pub(crate) fn list_icons(apps: &[DockApp]) -> TrayIconList {
    let (buttons, overflow_available) = tray_icons::list_tray_buttons();
    let icons = buttons
        .into_iter()
        .map(|button| {
            let matched = apps.iter().find(|app| matches(app, &button.name));
            let exe_path = matched.and_then(|app| app.exe_path.clone());
            let icon = exe_path.as_deref().and_then(host_icon::icon_data_url);
            TrayIcon {
                id: button.id,
                name: button.name,
                exe_path,
                icon,
                overflow: button.id.starts_with("overflow:"),
            }
        })
        .collect();
    TrayIconList {
        available: true,
        overflow_available,
        icons,
    }
}

pub(crate) fn click(icon_id: &str, right: bool) -> bool {
    tray_icons::click_tray_button(icon_id, right)
}
