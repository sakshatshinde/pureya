import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AlbumView } from "@/components/AlbumView";
import {
  PlayerControls,
  PlayerControlsProps,
} from "@/components/PlayerControls";

import {
  NowPlayingSidebar,
  QueueTrack,
  DetailedTrackInfo,
  QueueSummary,
} from "@/components/NowPlayingSidebar";

// --- Initial "Empty" or "Loading" States ---
const initialPlayerState: PlayerControlsProps = {
  isPlaying: false,
  isShuffleActive: false,
  repeatMode: "off",
  currentTrackInfo: {
    id: "0",
    title: "Nothing is playing...",
    artist: "Sakshat",
    albumArtUrl: undefined,
  },
  currentTime: 0,
  duration: 0,
  volume: 25,
  isMuted: false,
};

const initialQueueState: { tracks?: QueueTrack[]; summary?: QueueSummary } = {
  tracks: [],
  summary: { queuedText: "Queue empty" },
};

const initialSidebarTrackDetails: DetailedTrackInfo | undefined = undefined;

function Home() {
  // --- State for PlayerControls (consolidated) ---
  const [playerState, setPlayerState] =
    useState<PlayerControlsProps>(initialPlayerState);

  // --- State for NowPlayingSidebar ---
  const [queueTracks, _setQueueTracks] = useState<QueueTrack[] | undefined>(
    initialQueueState.tracks
  );
  const [sidebarTrackDetails, _setSidebarTrackDetails] = useState<
    DetailedTrackInfo | undefined
  >(initialSidebarTrackDetails);
  const [queueSummary, _setQueueSummary] = useState<QueueSummary | undefined>(
    initialQueueState.summary
  );

  // More stable callbacks if payloads are not objects or are memoized
  const handlePlayPause = useCallback(() => {
    invoke("player_toggle_play_pause_command").catch(console.error);
  }, []);
  const handleSkipNext = useCallback(() => {
    invoke("player_skip_next_command").catch(console.error);
  }, []);
  const handleSkipPrevious = useCallback(() => {
    invoke("player_skip_previous_command").catch(console.error);
  }, []);
  const handleShuffleToggle = useCallback(() => {
    invoke("player_toggle_shuffle_command").catch(console.error);
  }, []);
  const handleRepeatToggle = useCallback(() => {
    invoke("player_toggle_repeat_mode_command").catch(console.error);
  }, []);

  const handleSeek = useCallback(
    (seekPercentage: number) => {
      const seekPositionSeconds = (seekPercentage / 100) * playerState.duration;
      invoke("player_seek_command", {
        positionSeconds: seekPositionSeconds,
      }).catch(console.error);
    },
    [playerState.duration]
  );

  const handleVolumeChange = useCallback((newVolume: number) => {
    // Optimistic UI update
    setPlayerState((prev) => ({
      ...prev,
      volume: newVolume,
      isMuted: newVolume === 0,
    }));
    invoke("player_set_volume_command", { volume: newVolume }).catch(
      console.error
    );
  }, []);

  const handleMuteToggle = useCallback(() => {
    // Optimistic UI update
    setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    invoke("player_toggle_mute_command").catch(console.error);
  }, []);

  // --- Callbacks for NowPlayingSidebar ---
  // Since sidebar only shows playing track details, direct selection for *details* isn't needed.
  // If clicking a track in queue should PLAY it, that's a different command.
  const handlePlayTrackFromQueue = useCallback((trackId: string) => {
    console.log("Sidebar: Play track from queue:", trackId);
    invoke("player_play_track_from_queue_command", { trackId }).catch(
      console.error
    );
    // Rust will then emit player_state_update_event with the new playing track.
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <AlbumView />
        <NowPlayingSidebar
          queueTracks={queueTracks}
          currentTrackDetails={sidebarTrackDetails} // Always reflects playing track's details
          activeTrackId={playerState.currentTrackInfo?.id} // Highlights playing track in queue
          queueSummary={queueSummary}
          onTrackSelect={handlePlayTrackFromQueue} // Clicking a queue item now means "play this track"
        />
      </div>

      <PlayerControls
        {...playerState} // Spread all player state
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        onShuffleToggle={handleShuffleToggle}
        onRepeatToggle={handleRepeatToggle}
        onSeek={(seekPercentage) => {
          handleSeek(seekPercentage);
        }}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
      />
    </div>
  );
}

export default Home;
