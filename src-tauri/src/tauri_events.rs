// src/tauri_events.rs
// use super::player_state::{PlayerStateRust, QueueStateRust};
use serde::Serialize; // Adjust path if needed

#[allow(dead_code)]
pub const PLAYER_STATE_UPDATE_EVENT: &str = "player_state_update_event";
#[allow(dead_code)]
pub const QUEUE_STATE_UPDATE_EVENT: &str = "queue_state_update_event";
#[allow(dead_code)]
pub const PLAYER_TIME_UPDATE_EVENT: &str = "player_time_update_event";

#[derive(Serialize, Clone)]
pub struct PlayerTimeUpdatePayload {
    #[serde(rename = "currentTimeSeconds")]
    pub current_time_seconds: u32,
}

// For player_state_update_event, you'd emit a PlayerStateRust struct
// For queue_state_update_event, you'd emit a QueueStateRust struct
