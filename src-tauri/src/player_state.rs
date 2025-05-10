// src/player_state.rs
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlayerBarTrackInfoRust {
    pub id: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album_art_url: Option<String>,
    pub duration_seconds: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlayerStateRust {
    pub is_playing: bool,
    pub is_shuffle_active: bool,
    pub repeat_mode: String, // "off", "all", "one"
    pub current_track: Option<PlayerBarTrackInfoRust>,
    pub volume: u8, // 0-100
    pub is_muted: bool,
    pub current_time_seconds: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QueueTrackRust {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album_art_url: Option<String>,
    pub duration: String, // Formatted "MM:SS"
    #[serde(rename = "isPlaying")] // To match JS camelCase if needed
    pub is_playing: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct QueueSummaryRust {
    #[serde(rename = "selectedText")]
    pub selected_text: Option<String>,
    #[serde(rename = "queuedText")]
    pub queued_text: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct QueueStateRust {
    pub tracks: Vec<QueueTrackRust>,
    pub summary: Option<QueueSummaryRust>,
    // pub active_track_id: Option<String>, // If you want to send this from Rust
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

// Argument structs for commands
#[derive(Deserialize)]
pub struct SeekPayload {
    #[serde(rename = "positionSeconds")]
    pub position_seconds: f64, // f64 to match potential fractional seconds
}

#[derive(Deserialize)]
pub struct VolumePayload {
    pub volume: u8,
}

#[derive(Deserialize)]
pub struct TrackIdPayload {
    #[serde(rename = "trackId")]
    pub track_id: String,
}
