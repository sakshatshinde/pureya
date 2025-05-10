// src/main.rs (or lib.rs)

// If you created commands.rs, player_state.rs, tauri_events.rs
mod commands;
mod player_state;
mod tauri_events;

// If you're using managed state for your player:
// use std::sync::Mutex;
// use commands::AppState; // Assuming AppState is public

// pub struct AppStateInternal { /* ... your actual player logic and data ... */ }
// impl Default for AppStateInternal { /* ... */ }
// pub struct AppState(Mutex<AppStateInternal>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // let app_state = AppState(Mutex::new(AppStateInternal::default())); // Example for managed state

    tauri::Builder::default()
        // .manage(app_state) // If using Tauri managed state
        .plugin(tauri_plugin_opener::init())
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
            commands::get_queue_state_command,
            commands::get_track_details_command // Add any other commands here
        ])
        // Example of how to emit an event periodically (e.g., time updates)
        // You'd integrate this with your actual audio playback logic
        .setup(|app| {
            let _app_handle = app.handle().clone();
            // Example: If you want to simulate time updates from Rust
            // std::thread::spawn(move || {
            //     let mut current_time_seconds = 0;
            //     loop {
            //         std::thread::sleep(std::time::Duration::from_secs(1));
            //         // Check if music is playing from your app_state
            //         // If playing:
            //         // current_time_seconds += 1;
            //         // app_handle.emit_all(tauri_events::PLAYER_TIME_UPDATE_EVENT,
            //         //     tauri_events::PlayerTimeUpdatePayload { current_time_seconds }
            //         // ).unwrap();
            //         // If track ends, emit PLAYER_STATE_UPDATE_EVENT, etc.
            //     }
            // });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
