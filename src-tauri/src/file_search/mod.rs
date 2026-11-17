mod fallback;
mod records;
mod service;

use serde::Serialize;

use crate::user_error::UserError;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum FileSearchState {
    NotStarted,
    Building,
    Ready,
    Error,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileSearchItem {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub modified: Option<i64>,
    pub is_directory: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileSearchStatus {
    pub state: FileSearchState,
    pub indexed_count: usize,
    pub drives: Vec<String>,
    pub admin_required: bool,
    pub error: Option<String>,
}

#[tauri::command]
pub async fn file_search_status() -> Result<FileSearchStatus, UserError> {
    Ok(service::status())
}

#[tauri::command]
pub async fn search_files(query: String, limit: i64) -> Result<Vec<FileSearchItem>, UserError> {
    Ok(service::search(&query, limit))
}

#[tauri::command]
pub async fn start_file_index() -> Result<(), UserError> {
    service::start();
    Ok(())
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::file_search::file_search_status,
            crate::file_search::search_files,
            crate::file_search::start_file_index,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
