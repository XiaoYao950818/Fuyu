use hidapi::{HidApi, HidDevice};

use super::{unavailable, DeviceBattery};

const REPORT_LEN: usize = 20;
const LONG_REPORT_ID: u8 = 0x11;
const ROOT_FEATURE: u8 = 0;
const BATTERY_FEATURE_ID: u16 = 0x1004;
const SWID: u8 = 1;
const READ_TIMEOUT_MS: i32 = 1000;
const DRAIN_TIMEOUT_MS: i32 = 20;
const MAX_READ_ATTEMPTS: usize = 3;
const MAX_DRAIN_READS: usize = 5;

pub struct MouseSpec {
    pub id: &'static str,
    pub name: &'static str,
    pub vendor_id: u16,
    pub product_id: u16,
    pub device_id: u8,
}

pub const MICE: [MouseSpec; 2] = [
    MouseSpec {
        id: "gpw4",
        name: "PRO X SUPERLIGHT 2c",
        vendor_id: 0x046d,
        product_id: 0xc543,
        device_id: 1,
    },
    MouseSpec {
        id: "mx-master-4",
        name: "MX Master 4",
        vendor_id: 0x046d,
        product_id: 0xc548,
        device_id: 2,
    },
];

fn is_hidpp_interface(path: &str) -> bool {
    let lower = path.to_lowercase();
    lower.contains("mi_02") && lower.contains("col02")
}

fn open_mouse(api: &HidApi, spec: &MouseSpec) -> Option<HidDevice> {
    let info = api.device_list().find(|info| {
        info.vendor_id() == spec.vendor_id
            && info.product_id() == spec.product_id
            && is_hidpp_interface(&info.path().to_string_lossy())
    })?;
    api.open_path(info.path()).ok()
}

fn drain(device: &HidDevice) {
    let mut buffer = [0u8; REPORT_LEN];
    for _ in 0..MAX_DRAIN_READS {
        match device.read_timeout(&mut buffer, DRAIN_TIMEOUT_MS) {
            Ok(0) => break,
            Ok(_) => continue,
            Err(_) => break,
        }
    }
}

fn matches_response(buffer: &[u8; REPORT_LEN], device_id: u8, feature: u8, function: u8) -> bool {
    buffer[0] == LONG_REPORT_ID
        && buffer[1] == device_id
        && buffer[2] == feature
        && buffer[3] >> 4 == function
}

fn request(device: &HidDevice, device_id: u8, feature: u8, function: u8, params: &[u8]) -> Option<[u8; REPORT_LEN]> {
    drain(device);
    let mut message = [0u8; REPORT_LEN];
    message[0] = LONG_REPORT_ID;
    message[1] = device_id;
    message[2] = feature;
    message[3] = (function << 4) | SWID;
    let count = params.len().min(REPORT_LEN - 4);
    message[4..4 + count].copy_from_slice(&params[..count]);
    if device.write(&message).ok() != Some(REPORT_LEN) {
        return None;
    }
    let mut buffer = [0u8; REPORT_LEN];
    for _ in 0..MAX_READ_ATTEMPTS {
        match device.read_timeout(&mut buffer, READ_TIMEOUT_MS) {
            Ok(REPORT_LEN) if matches_response(&buffer, device_id, feature, function) => return Some(buffer),
            Ok(_) => continue,
            Err(_) => return None,
        }
    }
    None
}

fn feature_id_of(response: &[u8; REPORT_LEN]) -> u16 {
    u16::from_be_bytes([response[4], response[5]])
}

fn battery_of(response: &[u8; REPORT_LEN]) -> (u8, u8, u8) {
    (response[4], response[5], response[6])
}

fn battery_feature(device: &HidDevice, device_id: u8) -> Option<u8> {
    let count_response = request(device, device_id, ROOT_FEATURE, 1, &[])?;
    let count = count_response[4];
    for index in 0..=count {
        let response = request(device, device_id, ROOT_FEATURE, 0, &[index])?;
        if feature_id_of(&response) == BATTERY_FEATURE_ID {
            return Some(index);
        }
    }
    None
}

fn read_mouse(api: &HidApi, spec: &MouseSpec) -> DeviceBattery {
    let missing = unavailable(spec.id, spec.name);
    let device = match open_mouse(api, spec) {
        Some(device) => device,
        None => return missing,
    };
    let feature = match battery_feature(&device, spec.device_id) {
        Some(feature) => feature,
        None => return missing,
    };
    let response = match request(&device, spec.device_id, feature, 1, &[]) {
        Some(response) => response,
        None => return missing,
    };
    let (percent, level, state) = battery_of(&response);
    DeviceBattery {
        id: spec.id,
        name: spec.name,
        available: true,
        percent: Some(percent),
        level: Some(level),
        state: Some(state),
    }
}

pub fn read_batteries() -> Vec<DeviceBattery> {
    let api = match HidApi::new() {
        Ok(api) => api,
        Err(_) => return MICE.iter().map(|spec| unavailable(spec.id, spec.name)).collect(),
    };
    MICE.iter().map(|spec| read_mouse(&api, spec)).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn response(device_id: u8, feature: u8, function: u8, body: [u8; 4]) -> [u8; REPORT_LEN] {
        let mut buffer = [0u8; REPORT_LEN];
        buffer[0] = LONG_REPORT_ID;
        buffer[1] = device_id;
        buffer[2] = feature;
        buffer[3] = (function << 4) | SWID;
        buffer[4..8].copy_from_slice(&body);
        buffer
    }

    #[test]
    fn matches_response_checks_feature_and_function() {
        let buffer = response(1, 7, 1, [95, 8, 0, 0]);
        assert!(matches_response(&buffer, 1, 7, 1));
        assert!(!matches_response(&buffer, 2, 7, 1));
        assert!(!matches_response(&buffer, 1, 7, 0));
        let mut error = buffer;
        error[3] = ((1 | 0x08) << 4) | SWID;
        assert!(!matches_response(&error, 1, 7, 1));
    }

    #[test]
    fn feature_id_is_big_endian() {
        let buffer = response(1, 0, 0, [0x10, 0x04, 0, 0]);
        assert_eq!(feature_id_of(&buffer), 0x1004);
    }

    #[test]
    fn battery_body_is_percent_level_state() {
        let buffer = response(2, 9, 1, [95, 8, 0, 0]);
        assert_eq!(battery_of(&buffer), (95, 8, 0));
        let charging = response(1, 7, 1, [35, 4, 1, 0]);
        assert_eq!(battery_of(&charging), (35, 4, 1));
    }
}
