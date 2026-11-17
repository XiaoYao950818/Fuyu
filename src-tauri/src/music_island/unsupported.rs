use crate::user_error::UserError;

#[tauri::command]
pub async fn set_music_island_visible(_app: tauri::AppHandle, _visible: bool) -> Result<(), UserError> {
    Ok(())
}

#[tauri::command]
pub async fn request_music_island_close(_app: tauri::AppHandle) -> Result<(), UserError> {
    Ok(())
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::music_island::set_music_island_visible,
            crate::music_island::request_music_island_close,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
