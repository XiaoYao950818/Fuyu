use std::ffi::{c_void, OsStr};
use std::mem::size_of;
use std::os::windows::ffi::OsStrExt;

use windows::{
    core::{PCWSTR, PWSTR},
    Win32::{
        Foundation::{CloseHandle, GetLastError, ERROR_ACCESS_DENIED, GENERIC_READ, HANDLE},
        Storage::FileSystem::{
            CreateFileW, GetDriveTypeW, GetLogicalDriveStringsW, GetVolumeInformationW, DRIVE_FIXED, FILE_FLAG_BACKUP_SEMANTICS,
            FILE_SHARE_READ, FILE_SHARE_WRITE, OPEN_EXISTING,
        },
        System::Ioctl::{FSCTL_ENUM_USN_DATA, FSCTL_QUERY_USN_JOURNAL, FSCTL_READ_USN_JOURNAL, MFT_ENUM_DATA_V0, READ_USN_JOURNAL_DATA_V0},
        System::IO::DeviceIoControl,
    },
};

const BUFFER_SIZE: usize = 64 * 1024;
const ERROR_CODE_LEN: usize = 8;

pub(crate) struct VolumeHandle(HANDLE);

impl Drop for VolumeHandle {
    fn drop(&mut self) {
        if !self.0.is_invalid() {
            let _ = unsafe { CloseHandle(self.0) };
        }
    }
}

pub(crate) enum OpenVolumeError {
    AdminRequired,
    Failed(String),
}

fn wide(value: &str) -> Vec<u16> {
    OsStr::new(value).encode_wide().chain([0]).collect()
}

fn last_error() -> u32 {
    unsafe { GetLastError() }.0
}

fn control(handle: HANDLE, code: u32, input: &[u8], output: &mut [u8]) -> Result<u32, String> {
    let mut returned = 0u32;
    let ok = unsafe {
        DeviceIoControl(
            handle,
            code,
            if input.is_empty() { None } else { Some(input.as_ptr().cast::<c_void>()) },
            input.len() as u32,
            Some(output.as_mut_ptr().cast::<c_void>()),
            output.len() as u32,
            Some(&mut returned),
            None,
        )
    };
    if ok.as_bool() {
        Ok(returned)
    } else {
        Err(format!("DeviceIoControl {code} failed with Windows error {}", last_error()))
    }
}

pub(crate) fn list_fixed_drives() -> Vec<char> {
    let mut buffer = vec![0u16; 256];
    let length = unsafe { GetLogicalDriveStringsW(buffer.len() as u32, PWSTR(buffer.as_mut_ptr())) };
    if length == 0 || length as usize >= buffer.len() {
        return Vec::new();
    }
    let mut drives = Vec::new();
    for part in buffer[..length as usize].split(|unit| *unit == 0) {
        if part.len() >= 2 && part[1] == b':' as u16 {
            let root = wide(&String::from_utf16_lossy(part));
            if unsafe { GetDriveTypeW(PCWSTR(root.as_ptr())) } == DRIVE_FIXED {
                if let Some(letter) = char::from_u32(part[0] as u32) {
                    drives.push(letter);
                }
            }
        }
    }
    drives.sort_unstable();
    drives.dedup();
    drives
}

pub(crate) fn filesystem_type(letter: char) -> Option<String> {
    let root = wide(&format!("{letter}:\\"));
    let mut name = vec![0u16; 32];
    let ok = unsafe {
        GetVolumeInformationW(
            PCWSTR(root.as_ptr()),
            PWSTR(std::ptr::null_mut()),
            0,
            None,
            None,
            None,
            PWSTR(name.as_mut_ptr()),
            name.len() as u32,
        )
    };
    if !ok.as_bool() {
        return None;
    }
    let end = name.iter().position(|unit| *unit == 0).unwrap_or(name.len());
    Some(String::from_utf16_lossy(&name[..end]))
}

pub(crate) fn open_volume(letter: char) -> Result<VolumeHandle, OpenVolumeError> {
    let path = wide(&format!("\\\\.\\{letter}:"));
    let handle = unsafe {
        CreateFileW(
            PCWSTR(path.as_ptr()),
            GENERIC_READ,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            None,
            OPEN_EXISTING,
            FILE_FLAG_BACKUP_SEMANTICS,
            None,
        )
    };
    if handle.is_invalid() {
        let code = last_error();
        if code == ERROR_ACCESS_DENIED.0 {
            return Err(OpenVolumeError::AdminRequired);
        }
        return Err(OpenVolumeError::Failed(format!("Could not open volume {letter}: Windows error {code}")));
    }
    Ok(VolumeHandle(handle))
}

pub(crate) fn enum_usn_data(handle: &VolumeHandle, start: u64) -> Result<(u64, Vec<u8>), String> {
    let input = MFT_ENUM_DATA_V0 { StartFileReferenceNumber: start, LowUsn: 0, HighUsn: i64::MAX };
    let input_bytes = unsafe { std::slice::from_raw_parts((&input as *const MFT_ENUM_DATA_V0).cast::<u8>(), size_of::<MFT_ENUM_DATA_V0>()) };
    let mut output = vec![0u8; BUFFER_SIZE];
    let returned = control(handle.0, FSCTL_ENUM_USN_DATA, input_bytes, &mut output)?;
    let returned = returned as usize;
    if returned < ERROR_CODE_LEN {
        return Err("FSCTL_ENUM_USN_DATA returned too few bytes".to_string());
    }
    let next = u64::from_le_bytes(output[..8].try_into().unwrap_or([0; 8]));
    output.truncate(returned);
    Ok((next, output))
}

pub(crate) fn query_usn_journal(handle: &VolumeHandle) -> Result<(u64, i64), String> {
    let mut output = vec![0u8; 128];
    let returned = control(handle.0, FSCTL_QUERY_USN_JOURNAL, &[], &mut output)?;
    if (returned as usize) < 24 {
        return Err("FSCTL_QUERY_USN_JOURNAL returned too few bytes".to_string());
    }
    let journal_id = u64::from_le_bytes(output[..8].try_into().unwrap_or([0; 8]));
    let next_usn = i64::from_le_bytes(output[16..24].try_into().unwrap_or([0; 8]));
    Ok((journal_id, next_usn))
}

pub(crate) fn read_usn_journal(handle: &VolumeHandle, journal_id: u64, start_usn: i64) -> Result<(i64, Vec<u8>), String> {
    let input = READ_USN_JOURNAL_DATA_V0 { StartUsn: start_usn, ReasonMask: u32::MAX, ReturnOnlyOnClose: 0, Timeout: 0, BytesToWaitFor: 0, UsnJournalID: journal_id };
    let input_bytes = unsafe { std::slice::from_raw_parts((&input as *const READ_USN_JOURNAL_DATA_V0).cast::<u8>(), size_of::<READ_USN_JOURNAL_DATA_V0>()) };
    let mut output = vec![0u8; BUFFER_SIZE];
    let returned = control(handle.0, FSCTL_READ_USN_JOURNAL, input_bytes, &mut output)?;
    let returned = returned as usize;
    if returned < ERROR_CODE_LEN {
        return Err("FSCTL_READ_USN_JOURNAL returned too few bytes".to_string());
    }
    let next_usn = i64::from_le_bytes(output[..8].try_into().unwrap_or([0; 8]));
    output.truncate(returned);
    Ok((next_usn, output))
}
