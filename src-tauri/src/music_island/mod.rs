mod window;

use tauri::{AppHandle, Manager};

use crate::user_error::UserError;

pub(crate) const CLOSE_REQUESTED_EVENT: &str = "music-island-close-requested";

#[tauri::command]
pub async fn set_music_island_visible(app: AppHandle, visible: bool) -> Result<(), UserError> {
    if visible {
        window::show(&app);
    } else {
        window::hide(&app);
    }
    Ok(())
}

#[tauri::command]
pub async fn request_music_island_close(app: AppHandle) -> Result<(), UserError> {
    let _ = app.emit_to(window::WINDOW_LABEL, CLOSE_REQUESTED_EVENT, ());
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
