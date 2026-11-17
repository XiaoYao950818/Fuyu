use std::path::PathBuf;

const MAX_ENTRIES: usize = 2_000_000;

#[derive(Debug, Clone)]
pub struct FallbackEntry {
    pub id: u64,
    pub parent: u64,
    pub name: String,
    pub is_dir: bool,
}

pub fn walk_drive(letter: char) -> Vec<FallbackEntry> {
    let mut entries = vec![FallbackEntry { id: 0, parent: 0, name: String::new(), is_dir: true }];
    let mut next_id = 1u64;
    let mut stack = vec![(PathBuf::from(format!("{letter}:\\")), 0u64)];
    while let Some((path, parent)) = stack.pop() {
        let Ok(read) = std::fs::read_dir(&path) else { continue };
        for entry in read.flatten() {
            if entries.len() >= MAX_ENTRIES {
                return entries;
            }
            let name = entry.file_name().to_string_lossy().into_owned();
            if name.is_empty() {
                continue;
            }
            let is_dir = entry.file_type().map(|kind| kind.is_dir()).unwrap_or(false);
            let id = next_id;
            next_id += 1;
            if is_dir {
                stack.push((entry.path(), id));
            }
            entries.push(FallbackEntry { id, parent, name, is_dir });
        }
    }
    entries
}
