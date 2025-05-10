use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlayerBarTrackInfo {
    pub track_id: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album_art_url: Option<String>,
    pub duration_seconds: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlayerState {
    pub is_playing: bool,
    pub is_shuffle_active: bool,
    pub repeat_mode: String, // "off", "all", "one"
    pub current_track: Option<PlayerBarTrackInfo>,
    pub volume: u8, // 0-100
    pub is_muted: bool,
    pub current_time_seconds: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct DetailedTrackInfoRust {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub year: Option<String>,
    pub genre: Option<String>,
    #[serde(rename = "formatDetails")]
    pub format_details: Option<String>,
    #[serde(rename = "largeAlbumArtUrl")]
    pub large_album_art_url: Option<String>,
    // Add other fields as needed by your DetailedTrackInfo in TS
}

#[tauri::command]
pub async fn get_player_state_command(/*app_state: State<'_, AppState>*/)
 -> Result<PlayerState, String> {
    println!("Rust: get_player_state_command called");
    // TODO: Implement logic to retrieve current player state
    // Example placeholder:
    Ok(PlayerState {
        is_playing: false,
        is_shuffle_active: false,
        repeat_mode: "off".to_string(),
        current_track: None, // Some(PlayerBarTrackInfoRust { title: Some("Placeholder".to_string()), ..Default::default() }),
        volume: 75,
        is_muted: false,
        current_time_seconds: 0,
    })
    // Err("Player state not available".to_string())
}

#[tauri::command]
pub async fn player_toggle_play_pause_command(/*app_state: State<'_, AppState>*/)
 -> Result<(), String> {
    println!("Rust: player_toggle_play_pause_command called");
    // TODO: Implement logic to toggle play/pause
    // After toggling, emit PLAYER_STATE_UPDATE_EVENT with the new state
    Ok(())
}

#[tauri::command]
pub async fn player_skip_next_command(/*app_state: State<'_, AppState>*/) -> Result<(), String> {
    println!("Rust: player_skip_next_command called");
    // TODO: Implement logic to skip to the next track
    // Emit PLAYER_STATE_UPDATE_EVENT
    Ok(())
}

#[tauri::command]
pub async fn player_skip_previous_command(/*app_state: State<'_, AppState>*/) -> Result<(), String>
{
    println!("Rust: player_skip_previous_command called");
    // TODO: Implement logic to skip to the previous track
    // Emit PLAYER_STATE_UPDATE_EVENT
    Ok(())
}

#[tauri::command]
pub async fn player_toggle_shuffle_command(/*app_state: State<'_, AppState>*/) -> Result<(), String>
{
    println!("Rust: player_toggle_shuffle_command called");
    // TODO: Implement logic to toggle shuffle
    // Emit PLAYER_STATE_UPDATE_EVENT
    Ok(())
}

#[tauri::command]
pub async fn player_toggle_repeat_mode_command(/*app_state: State<'_, AppState>*/)
 -> Result<(), String> {
    println!("Rust: player_toggle_repeat_mode_command called");
    // TODO: Implement logic to cycle through repeat modes
    // Emit PLAYER_STATE_UPDATE_EVENT
    Ok(())
}

#[tauri::command]
pub async fn player_seek_command(/*app_state: State<'_, AppState>*/) -> Result<(), String> {
    println!("Rust: player_seek_command called with position_seconds:");

    Ok(())
}

#[tauri::command]
pub async fn player_set_volume_command(volume: u8) -> Result<(), String> {
    println!(
        "Rust: player_set_volume_command called with volume: {}",
        volume
    );

    Ok(())
}

#[tauri::command]
pub async fn player_toggle_mute_command(/*app_state: State<'_, AppState>*/) -> Result<(), String> {
    println!("Rust: player_toggle_mute_command called");

    Ok(())
}
