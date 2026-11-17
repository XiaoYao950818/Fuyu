mod service;

use serde::Serialize;

use crate::user_error::UserError;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetSpeed {
    pub available: bool,
    pub name: Option<String>,
    pub down_bytes_per_sec: u64,
    pub up_bytes_per_sec: u64,
    pub total_received_bytes: u64,
    pub total_sent_bytes: u64,
}

pub(crate) fn unavailable() -> NetSpeed {
    NetSpeed {
        available: false,
        name: None,
        down_bytes_per_sec: 0,
        up_bytes_per_sec: 0,
        total_received_bytes: 0,
        total_sent_bytes: 0,
    }
}

#[tauri::command]
pub async fn get_net_speed() -> Result<NetSpeed, UserError> {
    tauri::async_runtime::spawn_blocking(service::read)
        .await
        .map_err(|_| UserError::new("net-speed.read", "Failed to read network usage"))?
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::net_speed::get_net_speed,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
