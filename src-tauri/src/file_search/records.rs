pub const REASON_FILE_DELETE: u32 = 0x0000_0200;
pub const REASON_RENAME_OLD_NAME: u32 = 0x0000_1000;
pub const FILE_ATTRIBUTE_DIRECTORY: u32 = 0x0000_0010;

const RECORD_HEADER_LEN: usize = 60;

#[derive(Debug, Clone)]
pub struct UsnRecord {
    pub file_ref: u64,
    pub parent_ref: u64,
    pub reason: u32,
    pub attributes: u32,
    pub name: String,
}

pub fn record_number(file_ref: u64) -> u64 {
    file_ref & 0x0000_FFFF_FFFF_FFFF
}

fn read_u16(buffer: &[u8], offset: usize) -> Option<u16> {
    buffer.get(offset..offset + 2).and_then(|bytes| bytes.try_into().ok()).map(u16::from_le_bytes)
}

fn read_u32(buffer: &[u8], offset: usize) -> Option<u32> {
    buffer.get(offset..offset + 4).and_then(|bytes| bytes.try_into().ok()).map(u32::from_le_bytes)
}

fn read_u64(buffer: &[u8], offset: usize) -> Option<u64> {
    buffer.get(offset..offset + 8).and_then(|bytes| bytes.try_into().ok()).map(u64::from_le_bytes)
}

pub fn parse_usn_records(buffer: &[u8]) -> Vec<UsnRecord> {
    let mut records = Vec::new();
    let mut offset = 0usize;
    while offset + RECORD_HEADER_LEN <= buffer.len() {
        let Some(record_length) = read_u32(buffer, offset) else { break };
        let record_length = record_length as usize;
        if record_length < RECORD_HEADER_LEN || offset + record_length > buffer.len() {
            break;
        }
        let record = &buffer[offset..offset + record_length];
        let major = read_u16(record, 4).unwrap_or(0);
        if major == 2 {
            let name_length = read_u16(record, 56).unwrap_or(0) as usize;
            let name_offset = read_u16(record, 58).unwrap_or(0) as usize;
            if let (Some(file_ref), Some(parent_ref), Some(reason), Some(attributes)) = (
                read_u64(record, 8),
                read_u64(record, 16),
                read_u32(record, 40),
                read_u32(record, 52),
            ) {
                let name_end = name_offset.saturating_add(name_length).min(record.len());
                let name_units = record
                    .get(name_offset..name_end)
                    .map(|bytes| bytes.chunks_exact(2).map(|pair| u16::from_le_bytes([pair[0], pair[1]])).collect::<Vec<u16>>())
                    .unwrap_or_default();
                records.push(UsnRecord {
                    file_ref,
                    parent_ref,
                    reason,
                    attributes,
                    name: String::from_utf16_lossy(&name_units),
                });
            }
        }
        let stride = record_length.next_multiple_of(8).max(8);
        offset += stride;
    }
    records
}
