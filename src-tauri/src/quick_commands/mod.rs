mod service;

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
    if command.trim().is_empty() {
        return Err(UserError::new("quick-commands.empty", "The command is empty."));
    }
    tauri::async_runtime::spawn_blocking(move || service::run_command(&command))
        .await
        .map_err(|error| UserError::new("quick-commands.failed", "The command task failed.").detail(error))?
        .map_err(|error| UserError::new("quick-commands.failed", "The command could not run.").detail(error))
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::quick_commands::run_quick_command,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
