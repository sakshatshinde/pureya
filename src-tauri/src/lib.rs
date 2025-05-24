mod commands;

pub fn run() {
    tauri::Builder::default()
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
