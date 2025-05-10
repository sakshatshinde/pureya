import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, Event as TauriEvent, UnlistenFn } from "@tauri-apps/api/event";

import { AlbumView } from "@/components/AlbumView";
import {
  PlayerControls,
  PlayerControlsProps,
} from "@/components/PlayerControls";
// Assume PlayerControlsProps.currentTrackInfo includes an 'id'
// type PlayerBarTrackInfo = PlayerControlsProps["currentTrackInfo"]; // No longer strictly needed if we use PlayerControlsProps directly

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
    title: "Loading...",
    artist: "",
    albumArtUrl: undefined,
  },
  currentTime: 0,
  duration: 0,
  volume: 75,
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
  const [queueTracks, setQueueTracks] = useState<QueueTrack[] | undefined>(
    initialQueueState.tracks
  );
  const [sidebarTrackDetails, setSidebarTrackDetails] = useState<
    DetailedTrackInfo | undefined
  >(initialSidebarTrackDetails);
  const [queueSummary, setQueueSummary] = useState<QueueSummary | undefined>(
    initialQueueState.summary
  );
  // `activeTrackIdInQueue` will implicitly be playerState.currentTrackInfo.id

  // --- useEffect for Initial Data Load & Tauri Event Listeners ---
  useEffect(() => {
    console.log("Home: Mounting and setting up Tauri listeners/initial fetch.");
    let unlisteners: UnlistenFn[] = [];

    const setupTauriCommunication = async () => {
      try {
        // 1. Fetch initial full player and queue state from Rust
        const initialAppState: any = await invoke(
          "get_application_state_command"
        ); // A single command for initial overall state

        if (initialAppState.player) {
          const pState = initialAppState.player;
          setPlayerState({
            isPlaying: pState.is_playing || false,
            isShuffleActive: pState.is_shuffle_active || false,
            repeatMode: pState.repeat_mode || "off",
            currentTrackInfo: pState.current_track
              ? {
                  id: pState.current_track.id,
                  title: pState.current_track.title || "Unknown",
                  artist: pState.current_track.artist || "Unknown",
                  albumArtUrl: pState.current_track.album_art_url,
                }
              : initialPlayerState.currentTrackInfo,
            currentTime: pState.current_time_seconds || 0,
            duration: pState.current_track?.duration_seconds || 0,
            volume: pState.volume !== undefined ? pState.volume : 75,
            isMuted: pState.is_muted || false,
          });

          // If a track is playing, fetch its details for the sidebar
          if (pState.current_track?.id) {
            const details: DetailedTrackInfo = await invoke(
              "get_track_details_command",
              { trackId: pState.current_track.id }
            );
            setSidebarTrackDetails(details);
          }
        }

        if (initialAppState.queue) {
          setQueueTracks(initialAppState.queue.tracks || []);
          setQueueSummary(
            initialAppState.queue.summary || initialQueueState.summary
          );
        }

        // 2. Set up event listeners
        // Listener for comprehensive player state updates
        const playerUnlistener = await listen(
          "player_state_update_event",
          async (event: TauriEvent<any>) => {
            console.log(
              "Home: Received player_state_update_event",
              event.payload
            );
            const pState = event.payload; // Assume payload is the new PlayerStateRust
            setPlayerState((currentState) => ({
              // Use functional update for safety if needed
              ...currentState, // Preserve any parts not in payload if payload is partial
              isPlaying: pState.is_playing,
              isShuffleActive: pState.is_shuffle_active,
              repeatMode: pState.repeat_mode,
              currentTrackInfo: pState.current_track
                ? {
                    id: pState.current_track.id,
                    title: pState.current_track.title || "Unknown",
                    artist: pState.current_track.artist || "Unknown",
                    albumArtUrl: pState.current_track.album_art_url,
                  }
                : initialPlayerState.currentTrackInfo, // Fallback for player stopping
              duration: pState.current_track?.duration_seconds || 0,
              volume: pState.volume,
              isMuted: pState.is_muted,
              // currentTime will be handled by player_time_update_event
            }));

            // If new track is playing, update sidebar details
            if (
              pState.current_track?.id &&
              pState.current_track.id !== playerState.currentTrackInfo?.id
            ) {
              try {
                const details: DetailedTrackInfo = await invoke(
                  "get_track_details_command",
                  { trackId: pState.current_track.id }
                );
                setSidebarTrackDetails(details);
              } catch (e) {
                console.error("Failed to fetch details for new track", e);
                setSidebarTrackDetails(undefined);
              }
            } else if (!pState.current_track) {
              setSidebarTrackDetails(undefined); // Player stopped
            }
          }
        );
        unlisteners.push(playerUnlistener);

        // Listener for queue updates
        const queueUnlistener = await listen(
          "queue_state_update_event",
          (event: TauriEvent<any>) => {
            console.log(
              "Home: Received queue_state_update_event",
              event.payload
            );
            setQueueTracks(event.payload.tracks || []);
            setQueueSummary(event.payload.summary || initialQueueState.summary);
          }
        );
        unlisteners.push(queueUnlistener);

        // Listener specifically for frequent time updates
        const timeUnlistener = await listen(
          "player_time_update_event",
          (event: TauriEvent<{ current_time_seconds: number }>) => {
            setPlayerState((prev) => ({
              ...prev,
              currentTime: event.payload.current_time_seconds,
            }));
          }
        );
        unlisteners.push(timeUnlistener);
      } catch (error) {
        console.error("Home: Error during Tauri setup:", error);
      }
    };

    setupTauriCommunication();

    return () => {
      console.log("Home: Unmounting and cleaning up Tauri listeners.");
      unlisteners.forEach((unlisten) => unlisten());
    };
  }, [playerState.currentTrackInfo?.id]); // Re-run effect slightly if current track ID changes (for fetching details logic), but listeners only setup once.
  // More robust would be to manage listeners outside and only data fetching inside.
  // For simplicity, this is okay. Best is [] if listeners don't need re-registration.
  // Given `playerState.currentTrackInfo?.id` is used in the `player_state_update_event` listener's logic
  // for fetching details, adding it here is a simple way, but might lead to re-registering listeners.
  // A cleaner way is to ensure the listener itself has all data it needs or fetches it.
  // For this simplified version, let's stick to [] for initial setup.

  // --- Callbacks for PlayerControls (Simplified: Just invoke, Rust sends back full state update) ---
  const createPlayerCommandHandler = (command: string, payload?: any) => {
    return useCallback(() => {
      console.log(`Home: Invoking ${command}`, payload);
      invoke(command, payload).catch(console.error);
      // We expect Rust to emit 'player_state_update_event' with the new complete state
    }, [command, payload]); // This might cause too many re-renders if payload is an object.
    // For simple commands without payload, it's fine.
  };

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
      const seekPositionSeconds =
        (seekPercentage / 100) * (playerState.duration || 0);
      // Optimistic UI update for slider smoothness
      setPlayerState((prev) => ({ ...prev, currentTime: seekPositionSeconds }));
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
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
      />
    </div>
  );
}

export default Home;
