use std::collections::HashMap;
use std::path::Path;

use windows::{
    core::Interface,
    Win32::Media::Audio::{
        AudioSessionState, IAudioSessionControl2, IAudioSessionManager2, ISimpleAudioVolume,
    },
};

use super::{unavailable, AudioSession, VolumeState};
use crate::agent_status::host_icon;
use crate::media_control::audio::{read_master_volume, set_master_volume};
use crate::user_error::UserError;
use crate::win32::audio::{AudioDevices, OutputRole};
use crate::win32::audio_outputs::active_outputs;
use crate::win32::com::ComApartment;
use crate::win32::process;

fn read_error(error: impl std::fmt::Display) -> UserError {
    UserError::new("volume.read", "Failed to read the system volume").detail(error)
}

fn set_error(error: impl std::fmt::Display) -> UserError {
    UserError::new("volume.set", "Failed to change the volume").detail(error)
}

fn open_com() -> Result<ComApartment, UserError> {
    ComApartment::multithreaded().map_err(read_error)
}

fn default_output_name() -> Option<String> {
    let devices = AudioDevices::open().ok()?;
    let device = devices.default_output(OutputRole::Multimedia).ok()?;
    let id = device.id().ok()?;
    let outputs = active_outputs().ok()?;
    outputs
        .into_iter()
        .find(|output| output.id == id)
        .map(|output| output.name)
        .filter(|name| !name.is_empty())
}

fn session_name(control: &IAudioSessionControl2, process_id: u32) -> String {
    if let Ok(display) = control.GetDisplayName() {
        let name = display.to_string().unwrap_or_default();
        if !name.trim().is_empty() {
            return name;
        }
    }
    if process_id == 0 {
        return String::new();
    }
    process::image_path(process_id)
        .and_then(|path| {
            Path::new(&path)
                .file_stem()
                .map(|stem| stem.to_string_lossy().into_owned())
        })
        .unwrap_or_default()
}

fn read_sessions(manager: &IAudioSessionManager2) -> Vec<AudioSession> {
    let enumerator = match manager.GetSessionEnumerator() {
        Ok(enumerator) => enumerator,
        Err(_) => return Vec::new(),
    };
    let count = enumerator.GetCount().unwrap_or(0);
    let mut by_process: HashMap<u32, AudioSession> = HashMap::new();
    let mut order: Vec<u32> = Vec::new();
    for index in 0..count {
        let Ok(control) = enumerator.GetSession(index) else {
            continue;
        };
        let Ok(control2) = control.cast::<IAudioSessionControl2>() else {
            continue;
        };
        if control2.GetState().unwrap_or(AudioSessionState::AudioSessionStateExpired)
            == AudioSessionState::AudioSessionStateExpired
        {
            continue;
        }
        let Ok(process_id) = control2.GetProcessId() else {
            continue;
        };
        if by_process.contains_key(&process_id) {
            continue;
        }
        let Ok(simple) = control.cast::<ISimpleAudioVolume>() else {
            continue;
        };
        let volume = simple.GetMasterVolume().unwrap_or(0.0).clamp(0.0, 1.0);
        let muted = simple.GetMute().map(|muted| muted.as_bool()).unwrap_or(false);
        let name = session_name(&control2, process_id);
        let icon = process::image_path(process_id)
            .and_then(|path| host_icon::icon_data_url(&path));
        by_process.insert(
            process_id,
            AudioSession {
                id: process_id.to_string(),
                name,
                process_id,
                volume,
                muted,
                icon,
            },
        );
        order.push(process_id);
    }
    order
        .into_iter()
        .filter_map(|process_id| by_process.remove(&process_id))
        .collect()
}

pub(crate) fn read_state() -> Result<VolumeState, UserError> {
    let _apartment = open_com()?;
    let devices = AudioDevices::open().map_err(read_error)?;
    let device = match devices.default_output(OutputRole::Multimedia) {
        Ok(device) => device,
        Err(_) => return Ok(unavailable()),
    };
    let endpoint = match device.volume() {
        Ok(endpoint) => endpoint,
        Err(_) => return Ok(unavailable()),
    };
    let level = read_master_volume().unwrap_or(0.0);
    let muted = endpoint.muted().map_err(read_error)?;
    let output_name = default_output_name();
    let sessions = match device.session_manager() {
        Ok(manager) => read_sessions(&manager),
        Err(_) => Vec::new(),
    };
    Ok(VolumeState {
        available: true,
        level,
        muted,
        output_name,
        sessions,
    })
}

pub(crate) fn set_master_level(level: f32) -> Result<VolumeState, UserError> {
    let _apartment = ComApartment::multithreaded().map_err(set_error)?;
    set_master_volume(level).map_err(|error| UserError::new("volume.set", error))?;
    read_state().map_err(|_| UserError::new("volume.set", "Failed to read the system volume"))
}

pub(crate) fn set_master_mute(muted: bool) -> Result<VolumeState, UserError> {
    let _apartment = ComApartment::multithreaded().map_err(set_error)?;
    let devices = AudioDevices::open().map_err(set_error)?;
    let device = devices.default_output(OutputRole::Multimedia).map_err(set_error)?;
    let endpoint = device.volume().map_err(set_error)?;
    endpoint.set_mute(muted).map_err(set_error)?;
    read_state().map_err(|_| UserError::new("volume.set", "Failed to read the system volume"))
}

fn with_app_volume<T>(process_id: u32, apply: impl Fn(&ISimpleAudioVolume) -> windows::core::Result<T>) -> Result<bool, UserError> {
    let _apartment = ComApartment::multithreaded().map_err(set_error)?;
    let devices = AudioDevices::open().map_err(set_error)?;
    let device = devices.default_output(OutputRole::Multimedia).map_err(set_error)?;
    let manager = device.session_manager().map_err(set_error)?;
    let enumerator = manager.GetSessionEnumerator().map_err(set_error)?;
    let count = enumerator.GetCount().map_err(set_error)?;
    let mut found = false;
    for index in 0..count {
        let Ok(control) = enumerator.GetSession(index) else {
            continue;
        };
        let Ok(control2) = control.cast::<IAudioSessionControl2>() else {
            continue;
        };
        if control2.GetProcessId().unwrap_or(u32::MAX) != process_id {
            continue;
        }
        let Ok(simple) = control.cast::<ISimpleAudioVolume>() else {
            continue;
        };
        apply(&simple).map_err(set_error)?;
        found = true;
    }
    Ok(found)
}

pub(crate) fn set_app_level(process_id: u32, level: f32) -> Result<(), UserError> {
    let level = level.clamp(0.0, 1.0);
    let found = with_app_volume(process_id, |simple| {
        simple.SetMasterVolume(level, std::ptr::null())
    })?;
    if found {
        Ok(())
    } else {
        Err(UserError::new("volume.set", "The app is no longer playing audio"))
    }
}

pub(crate) fn set_app_mute(process_id: u32, muted: bool) -> Result<(), UserError> {
    let found = with_app_volume(process_id, |simple| {
        simple.SetMute(muted.into(), std::ptr::null())
    })?;
    if found {
        Ok(())
    } else {
        Err(UserError::new("volume.set", "The app is no longer playing audio"))
    }
}
