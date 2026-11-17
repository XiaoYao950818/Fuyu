use tauri::{
    AppHandle, Manager, Monitor, PhysicalPosition, PhysicalSize, Position, Size, WebviewWindow,
    WebviewWindowBuilder, WindowEvent,
};

use super::{screen_watch, screens, taskbar};

pub(crate) const WINDOW_LABEL: &str = "dock";
const LOGICAL_WIDTH: f64 = 760.0;
const LOGICAL_HEIGHT: f64 = 76.0;
const BOTTOM_GAP: f64 = 8.0;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct DockPlacement {
    pub(crate) x: i32,
    pub(crate) y: i32,
    pub(crate) width: u32,
    pub(crate) height: u32,
}

pub(crate) fn dock_window(app: &AppHandle) -> Option<WebviewWindow> {
    app.get_webview_window(WINDOW_LABEL)
}

pub(crate) fn placement_for(monitor: &Monitor) -> DockPlacement {
    let scale = monitor.scale_factor().max(0.1);
    let width = (LOGICAL_WIDTH * scale) as i32;
    let height = (LOGICAL_HEIGHT * scale) as i32;
    let origin = monitor.position();
    let size = monitor.size();
    DockPlacement {
        x: origin.x + (size.width as i32 - width) / 2,
        y: origin.y + size.height as i32 - height - (BOTTOM_GAP * scale) as i32,
        width: width as u32,
        height: height as u32,
    }
}

pub(crate) fn target_placement(
    app: &AppHandle,
    screen: screens::DockScreen,
) -> Option<DockPlacement> {
    screens::target_monitor(app, screen).map(|monitor| placement_for(&monitor))
}

pub(crate) fn current_placement(window: &WebviewWindow) -> Option<DockPlacement> {
    let position = window.outer_position().ok()?;
    let size = window.outer_size().ok()?;
    Some(DockPlacement {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
    })
}

pub(crate) fn apply_placement(window: &WebviewWindow, placement: DockPlacement) {
    let _ = window.set_size(Size::Physical(PhysicalSize {
        width: placement.width,
        height: placement.height,
    }));
    let _ = window.set_position(Position::Physical(PhysicalPosition {
        x: placement.x,
        y: placement.y,
    }));
}

fn position(app: &AppHandle, window: &WebviewWindow) {
    let Some(placement) = target_placement(app, screens::read_screen()) else {
        return;
    };
    apply_placement(window, placement);
}

fn create(app: &AppHandle) -> Result<WebviewWindow, String> {
    if let Some(window) = dock_window(app) {
        return Ok(window);
    }
    let config = app
        .config()
        .app
        .windows
        .iter()
        .find(|window| window.label == WINDOW_LABEL)
        .ok_or_else(|| "The dock window config was not found.".to_string())?
        .clone();
    let window = WebviewWindowBuilder::from_config(app, &config)
        .map_err(|error| error.to_string())?
        .visible(false)
        .build()
        .map_err(|error| format!("Could not create the dock window: {error}"))?;
    let handle = app.clone();
    window.on_window_event(move |event| match event {
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            hide(&handle);
            taskbar::set_enabled(false);
        }
        _ => {}
    });
    screen_watch::start(app.clone());
    Ok(window)
}

pub(crate) fn show(app: &AppHandle) {
    let handle = app.clone();
    let queued = app.run_on_main_thread(move || {
        let window = match create(&handle) {
            Ok(window) => window,
            Err(error) => {
                eprintln!("failed to create the dock window: {error}");
                taskbar::set_enabled(false);
                return;
            }
        };
        position(&handle, &window);
        if let Err(error) = window.show() {
            eprintln!("failed to show the dock window: {error}");
        }
    });
    if let Err(error) = queued {
        eprintln!("failed to show the dock window: {error}");
        taskbar::set_enabled(false);
    }
}

pub(crate) fn hide(app: &AppHandle) {
    let Some(window) = dock_window(app) else {
        return;
    };
    let _ = window.hide();
}
