use std::sync::{Mutex, PoisonError};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use windows::Foundation::DateTime;
use windows::Networking::Connectivity::{
    DataUsageGranularity, NetworkInformation, NetworkUsageStates, TriState,
};

use super::{unavailable, NetSpeed};
use crate::user_error::UserError;
use crate::win32::com::WinRtApartment;

const WINDOW_SECS: u64 = 1;
const CACHE_MS: u64 = 900;
const UNIX_TO_WIN_TICKS: u64 = 11_644_473_600;

struct State {
    total_received: u64,
    total_sent: u64,
    sample: Option<NetSpeed>,
    sampled_at: Option<Instant>,
}

static STATE: Mutex<State> = Mutex::new(State {
    total_received: 0,
    total_sent: 0,
    sample: None,
    sampled_at: None,
});

fn win_date_time(at: SystemTime) -> DateTime {
    let since_unix = at.duration_since(UNIX_EPOCH).unwrap_or(Duration::ZERO);
    let ticks = (since_unix.as_secs() + UNIX_TO_WIN_TICKS) * 10_000_000
        + u64::from(since_unix.subsec_nanos() / 100);
    DateTime {
        UniversalTime: ticks as i64,
    }
}

fn read_window() -> Result<Option<(Option<String>, u64, u64)>, windows::core::Error> {
    let _apartment = WinRtApartment::multithreaded()?;
    let profile = match NetworkInformation::GetInternetConnectionProfile() {
        Ok(profile) => profile,
        Err(_) => return Ok(None),
    };
    let raw_name = profile
        .ProfileName()
        .map(|value| value.to_string())
        .unwrap_or_default();
    let name = (!raw_name.is_empty()).then_some(raw_name);
    let end = SystemTime::now();
    let start = end
        .checked_sub(Duration::from_secs(WINDOW_SECS))
        .unwrap_or(UNIX_EPOCH);
    let operation = profile.GetNetworkUsageAsync(
        win_date_time(start),
        win_date_time(end),
        DataUsageGranularity::Total,
        NetworkUsageStates {
            Roaming: TriState::DoNotCare,
            Shared: TriState::DoNotCare,
        },
    )?;
    let usages = pollster::block_on(operation)?;
    let mut received = 0u64;
    let mut sent = 0u64;
    for usage in usages {
        received = received.saturating_add(usage.BytesReceived().unwrap_or(0));
        sent = sent.saturating_add(usage.BytesSent().unwrap_or(0));
    }
    Ok(Some((name, received, sent)))
}

pub(crate) fn read() -> Result<NetSpeed, UserError> {
    let mut state = STATE.lock().unwrap_or_else(PoisonError::into_inner);
    if let (Some(sample), Some(sampled_at)) = (&state.sample, state.sampled_at) {
        if sampled_at.elapsed().as_millis() < u128::from(CACHE_MS) {
            return Ok(sample.clone());
        }
    }
    let window = read_window().map_err(|error| {
        UserError::new("net-speed.read", "Failed to read network usage").detail(error)
    })?;
    let Some((name, received, sent)) = window else {
        let sample = unavailable();
        state.sample = Some(sample.clone());
        state.sampled_at = Some(Instant::now());
        return Ok(sample);
    };
    state.total_received = state.total_received.saturating_add(received);
    state.total_sent = state.total_sent.saturating_add(sent);
    let sample = NetSpeed {
        available: true,
        name,
        down_bytes_per_sec: received / WINDOW_SECS,
        up_bytes_per_sec: sent / WINDOW_SECS,
        total_received_bytes: state.total_received,
        total_sent_bytes: state.total_sent,
    };
    state.sample = Some(sample.clone());
    state.sampled_at = Some(Instant::now());
    Ok(sample)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn win_date_time_counts_from_1601() {
        assert_eq!(
            win_date_time(UNIX_EPOCH).UniversalTime,
            116_444_736_000_000_000
        );
        assert_eq!(
            win_date_time(UNIX_EPOCH + Duration::from_secs(1)).UniversalTime,
            116_444_736_010_000_000
        );
    }
}
