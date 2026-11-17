use serde::Serialize;

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

fn unavailable(id: &'static str, name: &'static str) -> DeviceBattery {
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
    vec![
        unavailable("gpw4", "PRO X SUPERLIGHT 2c"),
        unavailable("mx-master-4", "MX Master 4"),
    ]
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::device_battery::get_device_batteries,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
