use serde::Serialize;

use crate::user_error::UserError;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QuickCommandResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub timed_out: bool,
}

#[tauri::command]
pub async fn run_quick_command(command: String) -> Result<QuickCommandResult, UserError> {
    let _ = command;
    Err(crate::user_error::unsupported())
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::quick_commands::run_quick_command,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
