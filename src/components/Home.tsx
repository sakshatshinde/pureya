import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core"; // For invoking Rust commands
import { listen, Event as TauriEvent } from "@tauri-apps/api/event"; // For Tauri events

import { AlbumView } from "@/components/AlbumView";

import {
  PlayerControls,
  PlayerControlsProps,
} from "@/components/PlayerControls";

type PlayerBarTrackInfo = PlayerControlsProps["currentTrackInfo"];

import {
  NowPlayingSidebar,
  QueueTrack,
  DetailedTrackInfo,
  QueueSummary,
} from "@/components/NowPlayingSidebar";

// --- Placeholder Data (Initial state before Rust provides real data) ---
const placeholderAlbumArt =
  "https://static.wikia.nocookie.net/kpop/images/a/af/VIVIZ_Voyage_digital_album_cover.webp";

const initialPlayerBarTrackInfo: PlayerBarTrackInfo = {
  title: "Loading...",
  artist: "Waiting for player",
  albumArtUrl: placeholderAlbumArt,
};

const initialQueue: QueueTrack[] = [];
const initialSidebarTrackDetails: DetailedTrackInfo | undefined = undefined;
const initialQueueSummary: QueueSummary | undefined = {
  queuedText: "Queue empty",
};

function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffleActive, setIsShuffleActive] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] =
    useState<PlayerControlsProps["repeatMode"]>("off");
  const [playerCurrentTrack, setPlayerCurrentTrack] =
    useState<PlayerBarTrackInfo>(initialPlayerBarTrackInfo);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [queueTracks, setQueueTracks] = useState<QueueTrack[] | undefined>(
    initialQueue
  );
  const [sidebarTrackDetails, setSidebarTrackDetails] = useState<
    DetailedTrackInfo | undefined
  >(initialSidebarTrackDetails);
  const [activeTrackIdInQueue, setActiveTrackIdInQueue] = useState<
    string | undefined
  >(undefined);
  const [queueSummary, setQueueSummary] = useState<QueueSummary | undefined>(
    initialQueueSummary
  );

  useEffect(() => {
    // ... (setupTauriCommunication logic) ...
    console.log("Home: Mounting and setting up Tauri listeners/initial fetch.");

    let unlistenPlayerState: (() => void) | undefined;
    let unlistenQueueState: (() => void) | undefined;
    let unlistenTimeUpdate: (() => void) | undefined;

    const setupTauriCommunication = async () => {
      try {
        const initialPlayerState: any = await invoke(
          "get_player_state_command"
        );
        if (initialPlayerState) {
          setIsPlaying(initialPlayerState.is_playing || false);
          setIsShuffleActive(initialPlayerState.is_shuffle_active || false);
          setRepeatMode(initialPlayerState.repeat_mode || "off");
          if (initialPlayerState.current_track) {
            setPlayerCurrentTrack({
              title: initialPlayerState.current_track.title || "Unknown Title",
              artist:
                initialPlayerState.current_track.artist || "Unknown Artist",
              albumArtUrl: initialPlayerState.current_track.album_art_url,
            });
            setDuration(initialPlayerState.current_track.duration_seconds || 0);
          } else {
            setPlayerCurrentTrack(initialPlayerBarTrackInfo);
            setDuration(0);
          }
          setVolume(
            initialPlayerState.volume !== undefined
              ? initialPlayerState.volume
              : 75
          );
          setIsMuted(initialPlayerState.is_muted || false);
          setCurrentTime(initialPlayerState.current_time_seconds || 0);
        }

        const initialQueueState: any = await invoke("get_queue_state_command");
        if (initialQueueState) {
          setQueueTracks(initialQueueState.tracks || []);
          setQueueSummary(initialQueueState.summary || initialQueueSummary);
          if (initialQueueState.tracks && initialQueueState.tracks.length > 0) {
            const playingTrackInQueue = initialQueueState.tracks.find(
              (t: QueueTrack) => t.isPlaying
            );
            if (playingTrackInQueue) {
              setActiveTrackIdInQueue(playingTrackInQueue.id);
              const details: any = await invoke("get_track_details_command", {
                trackId: playingTrackInQueue.id,
              });
              setSidebarTrackDetails(details);
            }
          }
        }

        unlistenPlayerState = await listen(
          "player_state_update_event",
          (event: TauriEvent<any>) => {
            console.log(
              "Home: Received player_state_update_event",
              event.payload
            );
            const {
              is_playing,
              current_track,
              is_shuffle_active,
              repeat_mode,
              volume,
              is_muted,
            } = event.payload;
            setIsPlaying(is_playing);
            setIsShuffleActive(is_shuffle_active);
            setRepeatMode(repeat_mode);
            if (current_track) {
              setPlayerCurrentTrack({
                title: current_track.title || "Unknown Title",
                artist: current_track.artist || "Unknown Artist",
                albumArtUrl: current_track.album_art_url,
              });
              setDuration(current_track.duration_seconds || 0);
              setCurrentTime(0);
            } else {
              setPlayerCurrentTrack(initialPlayerBarTrackInfo);
              setDuration(0);
              setCurrentTime(0);
            }
            setVolume(volume);
            setIsMuted(is_muted);
          }
        );

        unlistenQueueState = await listen(
          "queue_state_update_event",
          (event: TauriEvent<any>) => {
            console.log(
              "Home: Received queue_state_update_event",
              event.payload
            );
            setQueueTracks(event.payload.tracks || []);
            setQueueSummary(event.payload.summary || initialQueueSummary);
            if (
              activeTrackIdInQueue &&
              !event.payload.tracks?.find(
                (t: QueueTrack) => t.id === activeTrackIdInQueue
              )
            ) {
              setActiveTrackIdInQueue(undefined);
              setSidebarTrackDetails(undefined);
            }
          }
        );

        unlistenTimeUpdate = await listen(
          "player_time_update_event",
          (event: TauriEvent<{ current_time_seconds: number }>) => {
            setCurrentTime(event.payload.current_time_seconds);
          }
        );
      } catch (error) {
        console.error("Home: Error during Tauri setup:", error);
      }
    };

    setupTauriCommunication();

    return () => {
      console.log("Home: Unmounting and cleaning up Tauri listeners.");
      unlistenPlayerState && unlistenPlayerState();
      unlistenQueueState && unlistenQueueState();
      unlistenTimeUpdate && unlistenTimeUpdate();
    };
  }, [activeTrackIdInQueue]); // Added activeTrackIdInQueue to dependency array if it's used inside listeners that might change it indirectly.
  // Or keep it empty [] if the listeners only set state and don't depend on its current value for re-registration.
  // For your current setup, [] is likely fine for listeners, but added for consideration if logic evolves.
  // Actually, for the current logic, [] is correct.

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
      const seekPositionSeconds = (seekPercentage / 100) * duration;
      setCurrentTime(seekPositionSeconds);
      invoke("player_seek_command", {
        positionSeconds: seekPositionSeconds,
      }).catch(console.error);
    },
    [duration]
  );

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    invoke("player_set_volume_command", { volume: newVolume }).catch(
      console.error
    );
  }, []);

  const handleMuteToggle = useCallback(() => {
    invoke("player_toggle_mute_command").catch(console.error);
  }, []);

  const handleTrackSelectFromQueue = useCallback(async (trackId: string) => {
    console.log("Sidebar: Track selected:", trackId);
    setActiveTrackIdInQueue(trackId);
    try {
      const details: DetailedTrackInfo = await invoke(
        "get_track_details_command",
        { trackId }
      );
      setSidebarTrackDetails(details);
    } catch (error) {
      console.error("Error fetching track details:", error);
      setSidebarTrackDetails(undefined);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <AlbumView />
        <NowPlayingSidebar
          queueTracks={queueTracks}
          currentTrackDetails={sidebarTrackDetails}
          activeTrackId={activeTrackIdInQueue}
          queueSummary={queueSummary}
          onTrackSelect={handleTrackSelectFromQueue}
        />
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        isShuffleActive={isShuffleActive}
        repeatMode={repeatMode}
        currentTrackInfo={playerCurrentTrack}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
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
