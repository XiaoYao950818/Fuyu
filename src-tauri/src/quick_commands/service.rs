use std::io::Read;
use std::process::{Command, Stdio};
use std::thread;
use std::time::{Duration, Instant};

use crate::system::{CommandExt, CREATE_NO_WINDOW};

use super::QuickCommandResult;

const TIMEOUT: Duration = Duration::from_secs(30);
const POLL_MS: u64 = 50;

fn read_stream(stream: impl Read + Send + 'static) -> thread::JoinHandle<String> {
    thread::spawn(move || {
        let mut stream = stream;
        let mut text = String::new();
        let _ = stream.read_to_string(&mut text);
        text
    })
}

pub fn run_command(command: &str) -> Result<QuickCommandResult, String> {
    let mut child = Command::new("powershell.exe")
        .args(["-NoProfile", "-Command", command])
        .creation_flags(CREATE_NO_WINDOW)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|error| format!("Could not start PowerShell: {error}"))?;
    let stdout = child.stdout.take().map(read_stream);
    let stderr = child.stderr.take().map(read_stream);
    let started = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => {
                let stdout = stdout.and_then(|handle| handle.join().ok()).unwrap_or_default();
                let stderr = stderr.and_then(|handle| handle.join().ok()).unwrap_or_default();
                return Ok(QuickCommandResult { stdout, stderr, exit_code: status.code(), timed_out: false });
            }
            Ok(None) if started.elapsed() < TIMEOUT => thread::sleep(Duration::from_millis(POLL_MS)),
            _ => {
                let _ = child.kill();
                let _ = child.wait();
                return Err("The command timed out after 30 seconds and was stopped.".to_string());
            }
        }
    }
}
