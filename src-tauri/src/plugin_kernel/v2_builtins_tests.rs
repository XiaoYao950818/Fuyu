use super::*;
use serde_json::json;

fn scratch(name: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join(format!("fuyu-v2-builtins-{name}-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(dir.join("plugins-v3")).unwrap();
    dir
}

fn timer() -> &'static Migration {
    &MIGRATIONS[0]
}

#[test]
fn the_timer_carries_its_switch_sound_and_shortcut() {
    let on = grants_of(json!({ "focusd.timer": { "enabled": true, "settings": { "sound": false }, "keybindings": { "new": "Ctrl+Shift+T" } } }));
    assert_eq!(plan(timer(), &on), Some(Plan { id: "timer", disable: false, config: vec![("sound", json!(false)), ("shortcut", json!("Ctrl+Shift+T"))] }));
    let off = grants_of(json!({ "focusd.timer": { "enabled": false } }));
    assert_eq!(plan(timer(), &off), Some(Plan { id: "timer", disable: true, config: vec![] }));
    let cleared = grants_of(json!({ "focusd.timer": { "enabled": true, "keybindings": { "new": "" } } }));
    assert_eq!(plan(timer(), &cleared).unwrap().config, vec![("shortcut", json!(""))]);
    assert_eq!(plan(timer(), &grants_of(json!({ "focusd.local-api": { "enabled": true } }))), None);
    assert!(grants("not json").is_empty());
}

fn grants_of(plugins: Value) -> Map<String, Value> {
    grants(&json!({ "plugins": plugins }).to_string())
}

#[test]
fn migrates_once_into_plugins_yml() {
    let home = scratch("once");
    let file = home.join("plugins-v3").join("plugins.yml");
    std::fs::write(home.join(V2_STATE), json!({ "plugins": { "focusd.timer": { "enabled": false, "settings": { "sound": false } } } }).to_string()).unwrap();
    migrate(&home, &file);
    assert_eq!(std::fs::read_to_string(&file).unwrap(), "- id: timer\n  disabled: true\n  config:\n    sound: false\n- id: local-api\n  disabled: true\n");
    std::fs::write(&file, "[]\n").unwrap();
    migrate(&home, &file);
    assert_eq!(std::fs::read_to_string(&file).unwrap(), "[]\n");
    let marker: Value = serde_json::from_str(&std::fs::read_to_string(home.join("plugins-v3").join(MARKER)).unwrap()).unwrap();
    assert_eq!(marker, json!({ "format": 1, "migrated": ["focusd.local-api", "focusd.timer"] }));
}

#[test]
fn without_old_settings_only_the_plugins_that_were_off_unless_granted_start_off() {
    let home = scratch("fresh");
    let file = home.join("plugins-v3").join("plugins.yml");
    migrate(&home, &file);
    assert_eq!(std::fs::read_to_string(&file).unwrap(), "- id: local-api\n  disabled: true\n");
    assert!(home.join("plugins-v3").join(MARKER).exists());
}

fn local_api() -> &'static Migration {
    MIGRATIONS.iter().find(|migration| migration.v3 == "local-api").unwrap()
}

#[test]
fn the_local_api_carries_its_switch_and_allow_write() {
    let on = grants_of(json!({ "focusd.local-api": { "enabled": true, "settings": { "allowWrite": true, "other": 1 } } }));
    assert_eq!(plan(local_api(), &on), Some(Plan { id: "local-api", disable: false, config: vec![("allowWrite", json!(true))] }));
    let odd = grants_of(json!({ "focusd.local-api": { "enabled": true, "settings": { "allowWrite": "yes" } } }));
    assert_eq!(plan(local_api(), &odd).unwrap().config, vec![]);
    assert_eq!(plan(local_api(), &Map::new()), Some(Plan { id: "local-api", disable: true, config: vec![] }));
}

#[test]
fn a_local_api_switched_on_before_the_v2_plugins_is_carried_from_local_api_json() {
    let old = with_old_local_api(Map::new(), Some(r#"{ "enabled": true, "allowWrite": true, "port": 39271, "token": "x" }"#));
    assert_eq!(plan(local_api(), &old), Some(Plan { id: "local-api", disable: false, config: vec![("allowWrite", json!(true))] }));
    let read_only = with_old_local_api(Map::new(), Some(r#"{ "enabled": false, "allowWrite": true }"#));
    assert_eq!(plan(local_api(), &read_only), Some(Plan { id: "local-api", disable: true, config: vec![("allowWrite", json!(true))] }));
    assert!(with_old_local_api(Map::new(), Some(r#"{ "enabled": false, "allowWrite": false }"#)).is_empty());
    assert!(with_old_local_api(Map::new(), Some("not json")).is_empty());
    let granted = grants_of(json!({ "focusd.local-api": { "enabled": false } }));
    assert_eq!(with_old_local_api(granted.clone(), Some(r#"{ "enabled": true }"#)), granted);
}
