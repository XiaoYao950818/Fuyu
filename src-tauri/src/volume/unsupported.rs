use serde::Serialize;

use crate::user_error::UserError;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AudioSession {
    pub id: String,
    pub name: String,
    pub process_id: u32,
    pub volume: f32,
    pub muted: bool,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VolumeState {
    pub available: bool,
    pub level: f32,
    pub muted: bool,
    pub output_name: Option<String>,
    pub sessions: Vec<AudioSession>,
}

fn unavailable() -> VolumeState {
    VolumeState {
        available: false,
        level: 0.0,
        muted: false,
        output_name: None,
        sessions: Vec::new(),
    }
}

#[tauri::command]
pub async fn get_volume_state() -> Result<VolumeState, UserError> {
    Ok(unavailable())
}

#[tauri::command]
pub async fn set_master_volume_level(_level: f32) -> Result<VolumeState, UserError> {
    Err(crate::user_error::unsupported())
}

#[tauri::command]
pub async fn set_master_muted(_muted: bool) -> Result<VolumeState, UserError> {
    Err(crate::user_error::unsupported())
}

#[tauri::command]
pub async fn set_session_volume(_process_id: u32, _level: f32) -> Result<(), UserError> {
    Err(crate::user_error::unsupported())
}

#[tauri::command]
pub async fn set_session_muted(_process_id: u32, _muted: bool) -> Result<(), UserError> {
    Err(crate::user_error::unsupported())
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::volume::get_volume_state,
            crate::volume::set_master_volume_level,
            crate::volume::set_master_muted,
            crate::volume::set_session_volume,
            crate::volume::set_session_muted,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
