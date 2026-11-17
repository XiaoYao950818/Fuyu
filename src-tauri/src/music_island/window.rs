use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, Position, Size, WebviewWindow, WebviewWindowBuilder, WindowEvent};

pub(crate) const WINDOW_LABEL: &str = "music-island";
const LOGICAL_WIDTH: f64 = 560.0;
const LOGICAL_HEIGHT: f64 = 132.0;
const TOP_GAP: f64 = 84.0;

pub(crate) fn music_island_window(app: &AppHandle) -> Option<WebviewWindow> {
    app.get_webview_window(WINDOW_LABEL)
}

fn position(app: &AppHandle, window: &WebviewWindow) {
    let Some(monitor) = app.primary_monitor().ok().flatten().or_else(|| app.available_monitors().ok().and_then(|monitors| monitors.into_iter().next())) else {
        return;
    };
    let scale = monitor.scale_factor().max(0.1);
    let width = (LOGICAL_WIDTH * scale) as i32;
    let height = (LOGICAL_HEIGHT * scale) as i32;
    let origin = monitor.position();
    let size = monitor.size();
    let x = origin.x + (size.width as i32 - width) / 2;
    let y = origin.y + (TOP_GAP * scale) as i32;
    let _ = window.set_size(Size::Physical(PhysicalSize { width: width as u32, height: height as u32 }));
    let _ = window.set_position(Position::Physical(PhysicalPosition { x, y }));
}

fn create(app: &AppHandle) -> Result<WebviewWindow, String> {
    if let Some(window) = music_island_window(app) {
        return Ok(window);
    }
    let config = app
        .config()
        .app
        .windows
        .iter()
        .find(|window| window.label == WINDOW_LABEL)
        .ok_or_else(|| "The music island window config was not found.".to_string())?
        .clone();
    let window = WebviewWindowBuilder::from_config(app, &config)
        .map_err(|error| error.to_string())?
        .visible(false)
        .build()
        .map_err(|error| format!("Could not create the music island window: {error}"))?;
    let handle = app.clone();
    window.on_window_event(move |event| match event {
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            hide(&handle);
        }
        _ => {}
    });
    Ok(window)
}

pub(crate) fn show(app: &AppHandle) {
    let handle = app.clone();
    let queued = app.run_on_main_thread(move || {
        let window = match create(&handle) {
            Ok(window) => window,
            Err(error) => {
                eprintln!("failed to create the music island window: {error}");
                return;
            }
        };
        position(&handle, &window);
        if let Err(error) = window.show() {
            eprintln!("failed to show the music island window: {error}");
        }
    });
    if let Err(error) = queued {
        eprintln!("failed to show the music island window: {error}");
    }
}

pub(crate) fn hide(app: &AppHandle) {
    let Some(window) = music_island_window(app) else {
        return;
    };
    let _ = window.hide();
}
