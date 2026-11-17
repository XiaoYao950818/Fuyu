use windows::{
    core::PCWSTR,
    Win32::{
        Foundation::{HWND, POINT},
        System::Variant::VARIANT,
        UI::{
            Accessibility::{
                IUIAutomationElement, IUIAutomationInvokePattern, TreeScope_Descendants, UIA_ButtonControlTypeId, UIA_ControlTypePropertyId,
                UIA_InvokePatternId,
            },
            Input::KeyboardAndMouse::{
                SendInput, INPUT, INPUT_0, INPUT_MOUSE, MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP, MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP,
                MOUSEINPUT,
            },
            WindowsAndMessaging::{FindWindowExW, FindWindowW, SetCursorPos},
        },
    },
};

use super::{com::ComApartment, uia_list, window};

pub(crate) struct TrayButton {
    pub id: String,
    pub name: String,
    pub x: i32,
    pub y: i32,
}

fn wide(text: &str) -> Vec<u16> {
    text.encode_utf16().chain(std::iter::once(0)).collect()
}

fn find_window(class: &str) -> HWND {
    let wide = wide(class);
    unsafe { FindWindowW(PCWSTR(wide.as_ptr()), PCWSTR::null()) }.unwrap_or_default()
}

fn find_child(parent: HWND, class: &str) -> HWND {
    let wide = wide(class);
    unsafe { FindWindowExW(Some(parent), None, PCWSTR(wide.as_ptr()), PCWSTR::null()) }.unwrap_or_default()
}

fn toolbar_windows() -> Vec<(bool, HWND)> {
    let mut found = Vec::new();
    let tray = find_window("Shell_TrayWnd");
    if !tray.is_invalid() {
        let notify = find_child(tray, "TrayNotifyWnd");
        if !notify.is_invalid() {
            let pager = find_child(notify, "SysPager");
            if !pager.is_invalid() {
                let toolbar = find_child(pager, "ToolbarWindow32");
                if !toolbar.is_invalid() {
                    found.push((false, toolbar));
                }
            }
        }
    }
    let overflow = find_window("NotifyIconOverflowWindow");
    if !overflow.is_invalid() {
        let toolbar = find_child(overflow, "ToolbarWindow32");
        if !toolbar.is_invalid() {
            found.push((true, toolbar));
        }
    }
    found
}

fn element_point(element: &IUIAutomationElement) -> Option<(i32, i32)> {
    unsafe {
        let mut point = POINT::default();
        if element.GetClickablePoint(&mut point).map(|clicked| clicked.as_bool()).unwrap_or(false) {
            return Some((point.x, point.y));
        }
        let rect = element.CurrentBoundingRectangle().ok()?;
        if rect.right <= rect.left || rect.bottom <= rect.top {
            return None;
        }
        Some(((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2))
    }
}

fn read_buttons(overflow: bool, toolbar: HWND) -> Vec<TrayButton> {
    let _com = ComApartment::multithreaded().ok();
    let read = || -> windows::core::Result<Vec<TrayButton>> {
        let automation = unsafe { uia_list::automation()? };
        let root = unsafe { automation.ElementFromHandle(toolbar)? };
        let condition = unsafe {
            automation.CreatePropertyCondition(UIA_ControlTypePropertyId, &VARIANT::from(UIA_ButtonControlTypeId.0))?
        };
        let found = unsafe { root.FindAll(TreeScope_Descendants, &condition)? };
        let count = unsafe { found.Length()? };
        let mut buttons = Vec::new();
        let source = if overflow { "overflow" } else { "main" };
        for index in 0..count {
            let element = match unsafe { found.GetElement(index) } {
                Ok(element) => element,
                Err(_) => continue,
            };
            let Some((x, y)) = element_point(&element) else {
                continue;
            };
            let name = unsafe { element.CurrentName().map(|name| name.to_string()).unwrap_or_default() };
            buttons.push(TrayButton { id: format!("{source}:{index}"), name, x, y });
        }
        Ok(buttons)
    };
    read().unwrap_or_default()
}

pub(crate) fn list_tray_buttons() -> (Vec<TrayButton>, bool) {
    let toolbars = toolbar_windows();
    let overflow_available = toolbars.iter().any(|(overflow, _)| *overflow);
    let mut buttons = Vec::new();
    for (overflow, toolbar) in toolbars {
        buttons.extend(read_buttons(overflow, toolbar));
    }
    (buttons, overflow_available)
}

fn mouse_click(x: i32, y: i32, right: bool) -> bool {
    let back = window::cursor_position();
    if unsafe { SetCursorPos(x, y) }.is_err() {
        return false;
    }
    let (down, up) = if right {
        (MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP)
    } else {
        (MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP)
    };
    let input = |flags| INPUT {
        r#type: INPUT_MOUSE,
        Anonymous: INPUT_0 {
            mi: MOUSEINPUT { dwFlags: flags, ..Default::default() },
        },
    };
    let sent = unsafe { SendInput(&[input(down), input(up)], std::mem::size_of::<INPUT>() as i32) };
    std::thread::sleep(std::time::Duration::from_millis(50));
    if let Some(back) = back {
        let _ = unsafe { SetCursorPos(back.x, back.y) };
    }
    sent == 2
}

pub(crate) fn click_tray_button(id: &str, right: bool) -> bool {
    let Some((source, index)) = id.split_once(':') else {
        return false;
    };
    let Ok(index) = index.parse::<i32>() else {
        return false;
    };
    let overflow = source == "overflow";
    let (buttons, _) = list_tray_buttons();
    let Some(button) = buttons.into_iter().find(|button| button.id == id) else {
        return false;
    };
    if right {
        return mouse_click(button.x, button.y, true);
    }
    let _com = ComApartment::multithreaded().ok();
    let invoke = || -> windows::core::Result<bool> {
        let automation = unsafe { uia_list::automation()? };
        let toolbars = toolbar_windows();
        let toolbar = toolbars.into_iter().find(|(is_overflow, _)| *is_overflow == overflow).map(|(_, window)| window);
        let Some(toolbar) = toolbar else {
            return Ok(false);
        };
        let root = unsafe { automation.ElementFromHandle(toolbar)? };
        let condition = unsafe {
            automation.CreatePropertyCondition(UIA_ControlTypePropertyId, &VARIANT::from(UIA_ButtonControlTypeId.0))?
        };
        let found = unsafe { root.FindAll(TreeScope_Descendants, &condition)? };
        let element = unsafe { found.GetElement(index)? };
        let pattern: IUIAutomationInvokePattern = unsafe { element.GetCurrentPatternAs(UIA_InvokePatternId)? };
        unsafe { pattern.Invoke()? };
        Ok(true)
    };
    invoke().unwrap_or(false) || mouse_click(button.x, button.y, false)
}
