use serde_json::{Map, Value};

use super::manifest::{parse_builtin_manifest, PluginManifest};
use super::settings::InfoItem;
use crate::ssh_tunnel;

pub(super) const SSH_TUNNEL_ID: &str = "focusd.ssh-proxy-tunnel";

const SSH_TUNNEL_MANIFEST: &str = r#"{
  "id": "focusd.ssh-proxy-tunnel",
  "name": { "zh-CN": "SSH 代理隧道", "en": "SSH proxy tunnel" },
  "description": {
    "zh-CN": "把这台电脑的代理借给 SSH 服务器：为下面打开的每台主机常驻一条 ssh 反向隧道（服务器上的 127.0.0.1:端口 → 这里的本地代理），服务器上设好 http_proxy 就能经这里上网。主机来自 ~/.ssh/config 和 AI Agent 页添加的电脑，只用密钥登录；断开后自动重连，关闭插件或退出岛屿时隧道一起结束。",
    "en": "Lends this computer's proxy to SSH servers: for each host switched on below, a resident ssh reverse tunnel (127.0.0.1:port on the server to the local proxy here), so the server reaches the internet through here once http_proxy is set there. Hosts come from ~/.ssh/config and the computers added on the AI Agent page, key login only; it reconnects after a drop, and the tunnels end when the plugin is switched off or the island quits."
  },
  "version": "1.0.0",
  "apiVersion": 1,
  "author": "ShengLin1001",
  "runtime": { "type": "builtin" },
  "contributes": {
    "settings": [
      {
        "key": "localProxy",
        "type": "select",
        "title": { "zh-CN": "本地代理", "en": "Local proxy" },
        "description": {
          "zh-CN": "隧道转发到这台电脑上的哪个代理端口。自动检测依次看 Clash Verge 的设置、正在运行的 v2rayN 的设置和 Windows 系统代理，再试两者的默认端口，用第一个真有程序在监听的；之后每 15 秒再看一次，端口变了隧道跟着换。选 Clash Verge 或 v2rayN 时也先读它们的设置，读不到才用默认端口（7897、10808）。",
          "en": "Which proxy port on this computer the tunnels forward to. Auto looks in turn at Clash Verge's settings, a running v2rayN's settings and the Windows system proxy, then tries both apps' default ports, and takes the first one something listens on; it looks again every 15 seconds and moves the tunnels when the port changes. Clash Verge and v2rayN also read the app's settings first, and use the default port (7897, 10808) only when there are none."
        },
        "default": "auto",
        "options": [
          { "value": "auto", "title": { "zh-CN": "自动检测", "en": "Auto" } },
          { "value": "clash-verge", "title": { "zh-CN": "Clash Verge（默认 7897）", "en": "Clash Verge (7897 by default)" } },
          { "value": "v2rayn", "title": { "zh-CN": "v2rayN（默认 10808）", "en": "v2rayN (10808 by default)" } },
          { "value": "custom", "title": { "zh-CN": "自定义端口", "en": "Custom port" } }
        ]
      },
      {
        "key": "customPort",
        "type": "number",
        "title": { "zh-CN": "本地端口", "en": "Local port" },
        "min": 1,
        "max": 65535,
        "default": 7897
      }
    ]
  }
}"#;

pub(super) const BUILTINS: &[(&str, &str, bool)] = &[
    (SSH_TUNNEL_ID, SSH_TUNNEL_MANIFEST, true),
];

pub(super) fn manifests(app_version: &str) -> Vec<(&'static str, Result<PluginManifest, String>)> {
    BUILTINS.iter().map(|&(id, text, _)| (id, parse_builtin_manifest(text, id, app_version))).collect()
}

pub(super) fn is_builtin(id: &str) -> bool {
    BUILTINS.iter().any(|&(builtin, _, _)| builtin == id)
}

pub(super) fn has_native_work(builtins: &[(&str, &str, bool)], id: &str) -> Result<bool, String> {
    builtins
        .iter()
        .find(|&&(builtin, _, _)| builtin == id)
        .map(|&(_, _, native)| native)
        .ok_or_else(|| format!("Unknown built-in plugin {id}."))
}

pub(super) fn start(id: &str, settings: &Map<String, Value>) -> Result<Vec<InfoItem>, String> {
    if !has_native_work(BUILTINS, id)? {
        return Ok(Vec::new());
    }
    match id {
        SSH_TUNNEL_ID => ssh_tunnel::start(settings).map(|()| Vec::new()),
        _ => Err(format!("Built-in plugin {id} is marked native but has no start.")),
    }
}

pub(super) fn stop(id: &str) -> Result<(), String> {
    if !has_native_work(BUILTINS, id)? {
        return Ok(());
    }
    match id {
        SSH_TUNNEL_ID => {
            ssh_tunnel::stop();
            Ok(())
        }
        _ => Ok(()),
    }
}

pub(super) fn settings_changed(id: &str, settings: &Map<String, Value>) -> Result<(), String> {
    match id {
        SSH_TUNNEL_ID => ssh_tunnel::start(settings),
        _ => Ok(()),
    }
}

pub(super) fn run_command(_id: &str, _command: &str) -> Result<Vec<InfoItem>, String> {
    Err("Unknown plugin command.".into())
}
