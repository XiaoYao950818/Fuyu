mod service;

use serde::Serialize;
use service::read_batteries;

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceBattery {
    pub id: &'static str,
    pub name: &'static str,
    pub available: bool,
    pub percent: Option<u8>,
    pub level: Option<u8>,
    pub state: Option<u8>,
}

pub(crate) fn unavailable(id: &'static str, name: &'static str) -> DeviceBattery {
    DeviceBattery {
        id,
        name,
        available: false,
        percent: None,
        level: None,
        state: None,
    }
}

#[tauri::command]
pub async fn get_device_batteries() -> Vec<DeviceBattery> {
    read_batteries()
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::device_battery::get_device_batteries,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
