use tauri::Listener;
// use tauri::Manager;
// use tauri::State;
use tauri_plugin_store::StoreExt;

mod commands;

// use std::sync::Mutex;

// pub struct AppState {
//     pub scan_on_startup: Mutex<bool>,
// }

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.listen("library-path-updated", |event| {
                let path = event.payload();
                let _ = set_library_path(path);
            });

            let store = app.store("settings.json")?;
            let _val = store
                .get("scanOnStartup")
                .expect("Failed to get value of scanOnStartup")
                .as_bool()
                .expect("Failed to convert scanOnStartup to boolean");

            // let app_state = app.state::<AppState>();

            // set_scan_on_startup(app_state, val)?;

            store.close_resource();

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::get_player_state_command,
            commands::player_toggle_play_pause_command,
            commands::player_skip_next_command,
            commands::player_skip_previous_command,
            commands::player_toggle_shuffle_command,
            commands::player_toggle_repeat_mode_command,
            commands::player_seek_command,
            commands::player_set_volume_command,
            commands::player_toggle_mute_command,
        ])
        .run(tauri::generate_context!())
        .expect("Something went really wrong while launching Pureya");
}

fn set_library_path(/*app_state: State<'_, AppState>*/ path: &str) -> Result<(), String> {
    println!("Rust: set_library_path called: {}", path);

    Ok(())
}

// fn set_scan_on_startup(app_state: State<'_, AppState>, val: bool) -> Result<(), String> {
//     let mut _guard_scan_on_startup = app_state
//         .scan_on_startup
//         .lock()
//         .map_err(|e| e.to_string())?;

//     *_guard_scan_on_startup = val;
//     Ok(())
// }
