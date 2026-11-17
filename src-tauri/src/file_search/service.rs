use std::collections::{HashMap, HashSet};
use std::sync::{Mutex, OnceLock};
use std::thread;
use std::time::{Duration, UNIX_EPOCH};

use crate::win32::mft::{self, OpenVolumeError};

use super::records::{
    FILE_ATTRIBUTE_DIRECTORY, REASON_FILE_DELETE, REASON_RENAME_OLD_NAME, UsnRecord, parse_usn_records, record_number,
};
use super::{FileSearchItem, FileSearchState, FileSearchStatus};
use crate::file_search::fallback;

const ROOT_RECORD: u64 = 5;
const JOURNAL_POLL: Duration = Duration::from_secs(15);
const MAX_COLLECTED: usize = 5_000;

#[derive(Debug, Clone)]
struct Entry {
    parent: u64,
    name: String,
    is_dir: bool,
}

#[derive(Debug, Clone)]
struct DriveState {
    letter: char,
    ntfs: bool,
    next_usn: i64,
    journal_id: u64,
}

#[derive(Debug)]
struct Index {
    building: bool,
    ready: bool,
    admin_required: bool,
    error: Option<String>,
    drives: Vec<String>,
    drive_states: Vec<DriveState>,
    entries: HashMap<u64, Entry>,
}

impl Index {
    fn new() -> Self {
        Self { building: false, ready: false, admin_required: false, error: None, drives: Vec::new(), drive_states: Vec::new(), entries: HashMap::new() }
    }
}

fn index() -> &'static Mutex<Index> {
    static INDEX: OnceLock<Mutex<Index>> = OnceLock::new();
    INDEX.get_or_init(|| Mutex::new(Index::new()))
}

fn lock_index() -> std::sync::MutexGuard<'static, Index> {
    index().lock().unwrap_or_else(|poisoned| poisoned.into_inner())
}

fn drive_key(drive: usize, record: u64) -> u64 {
    ((drive as u64) << 48) | record_number(record)
}

pub fn status() -> FileSearchStatus {
    let state = lock_index();
    let phase = if state.ready {
        FileSearchState::Ready
    } else if state.error.is_some() {
        FileSearchState::Error
    } else if state.building {
        FileSearchState::Building
    } else {
        FileSearchState::NotStarted
    };
    FileSearchStatus {
        state: phase,
        indexed_count: state.entries.len(),
        drives: state.drives.clone(),
        admin_required: state.admin_required,
        error: state.error.clone(),
    }
}

pub fn start() {
    {
        let state = lock_index();
        if state.building || state.ready {
            return;
        }
    }
    thread::spawn(build_and_watch);
}

fn build_path(state: &Index, drive: usize, mut key: u64) -> String {
    let letter = state.drive_states.get(drive).map(|drive_state| drive_state.letter).unwrap_or('C');
    let mut parts: Vec<&str> = Vec::new();
    let mut seen: HashSet<u64> = HashSet::new();
    for _ in 0..512 {
        if !seen.insert(key) {
            break;
        }
        let Some(entry) = state.entries.get(&key) else { break };
        if !entry.name.is_empty() {
            parts.push(&entry.name);
        }
        if entry.parent == key {
            break;
        }
        key = entry.parent;
    }
    parts.reverse();
    if parts.is_empty() {
        format!("{letter}:\\")
    } else {
        format!("{letter}:\\{}", parts.join("\\"))
    }
}

fn insert_record(state: &mut Index, drive: usize, record: &UsnRecord) {
    if record.name.is_empty() || record.name == "." || record.name.starts_with('$') {
        return;
    }
    let key = drive_key(drive, record.file_ref);
    let parent = drive_key(drive, record.parent_ref);
    state.entries.insert(key, Entry { parent, name: record.name.clone(), is_dir: record.attributes & FILE_ATTRIBUTE_DIRECTORY != 0 });
}

fn apply_journal_record(state: &mut Index, drive: usize, record: &UsnRecord) {
    if record.reason & REASON_FILE_DELETE != 0 || record.reason & REASON_RENAME_OLD_NAME != 0 {
        state.entries.remove(&drive_key(drive, record.file_ref));
        return;
    }
    insert_record(state, drive, record);
}

fn build_drive(drive: usize, letter: char, merge: &mut dyn FnMut(Vec<(u64, Entry)>)) -> (Option<DriveState>, bool, Option<String>) {
    let fs_type = mft::filesystem_type(letter);
    if fs_type.as_deref() != Some("NTFS") {
        let root = drive_key(drive, 0);
        let mut entries = vec![(root, Entry { parent: root, name: String::new(), is_dir: true })];
        for entry in fallback::walk_drive(letter) {
            let key = drive_key(drive, entry.id);
            let parent = drive_key(drive, entry.parent);
            entries.push((key, Entry { parent, name: entry.name, is_dir: entry.is_dir }));
        }
        merge(entries);
        return (Some(DriveState { letter, ntfs: false, next_usn: 0, journal_id: 0 }), false, None);
    }
    let handle = match mft::open_volume(letter) {
        Ok(handle) => handle,
        Err(OpenVolumeError::AdminRequired) => {
            return (None, true, Some("Administrator rights are required to read the NTFS master file table.".to_string()));
        }
        Err(OpenVolumeError::Failed(message)) => return (None, false, Some(message)),
    };
    let root = drive_key(drive, ROOT_RECORD);
    merge(vec![(root, Entry { parent: root, name: String::new(), is_dir: true })]);
    let mut start = 0u64;
    loop {
        let Ok((next, buffer)) = mft::enum_usn_data(&handle, start) else { break };
        let records = if buffer.len() > 8 { parse_usn_records(&buffer[8..]) } else { Vec::new() };
        let mut entries: Vec<(u64, Entry)> = Vec::new();
        for record in &records {
            if record.name.is_empty() || record.name == "." || record.name.starts_with('$') {
                continue;
            }
            let key = drive_key(drive, record.file_ref);
            let parent = drive_key(drive, record.parent_ref);
            entries.push((key, Entry { parent, name: record.name.clone(), is_dir: record.attributes & FILE_ATTRIBUTE_DIRECTORY != 0 }));
        }
        merge(entries);
        if next == 0 || next == start {
            break;
        }
        start = next;
    }
    let (journal_id, next_usn) = mft::query_usn_journal(&handle).unwrap_or((0, 0));
    (Some(DriveState { letter, ntfs: true, next_usn, journal_id }), false, None)
}

fn build_and_watch() {
    {
        let mut state = lock_index();
        state.building = true;
        state.ready = false;
        state.admin_required = false;
        state.error = None;
        state.drives.clear();
        state.drive_states.clear();
        state.entries.clear();
    }
    let drives = mft::list_fixed_drives();
    for (drive, letter) in drives.iter().enumerate() {
        let (drive_state, admin_required, error) = build_drive(drive, *letter, &mut |chunk| {
            let mut state = lock_index();
            for (key, entry) in chunk {
                state.entries.insert(key, entry);
            }
        });
        let mut state = lock_index();
        if let Some(drive_state) = drive_state {
            state.drive_states.push(drive_state);
            state.drives.push(letter.to_string());
        }
        if admin_required {
            state.admin_required = true;
        }
        if error.is_some() {
            state.error = error;
        }
    }
    {
        let mut state = lock_index();
        state.building = false;
        state.ready = !state.entries.is_empty();
        if state.drives.is_empty() && state.error.is_none() {
            state.error = Some("No fixed drives were found.".to_string());
        }
    }
    loop {
        thread::sleep(JOURNAL_POLL);
        let drive_states = {
            let state = lock_index();
            if !state.ready {
                return;
            }
            state.drive_states.clone()
        };
        for (drive, drive_state) in drive_states.iter().enumerate() {
            if !drive_state.ntfs || drive_state.journal_id == 0 {
                continue;
            }
            let Ok(handle) = mft::open_volume(drive_state.letter) else { continue };
            let Ok((next_usn, buffer)) = mft::read_usn_journal(&handle, drive_state.journal_id, drive_state.next_usn) else { continue };
            let records = if buffer.len() > 8 { parse_usn_records(&buffer[8..]) } else { Vec::new() };
            let mut state = lock_index();
            for record in &records {
                apply_journal_record(&mut state, drive, record);
            }
            if let Some(current) = state.drive_states.get_mut(drive) {
                current.next_usn = next_usn;
            }
        }
    }
}

pub fn search(query: &str, limit: i64) -> Vec<FileSearchItem> {
    let limit = limit.clamp(1, 1000) as usize;
    let needle = query.trim().to_lowercase();
    if needle.is_empty() {
        return Vec::new();
    }
    let state = lock_index();
    if !state.ready {
        return Vec::new();
    }
    let mut matches: Vec<(&u64, &Entry)> = Vec::new();
    for (key, entry) in state.entries.iter() {
        if entry.name.to_lowercase().contains(&needle) {
            matches.push((key, entry));
            if matches.len() >= MAX_COLLECTED {
                break;
            }
        }
    }
    matches.sort_by(|left, right| left.1.name.to_lowercase().cmp(&right.1.name.to_lowercase()));
    matches.truncate(limit);
    matches
        .iter()
        .map(|(key, entry)| {
            let drive = (**key >> 48) as usize;
            let path = build_path(&state, drive, **key);
            let (size, modified) = match std::fs::metadata(&path) {
                Ok(metadata) => (
                    metadata.len(),
                    metadata.modified().ok().and_then(|time| time.duration_since(UNIX_EPOCH).ok()).map(|duration| duration.as_millis() as i64),
                ),
                Err(_) => (0, None),
            };
            FileSearchItem { name: entry.name.clone(), path, size, modified, is_directory: entry.is_dir }
        })
        .collect()
}
