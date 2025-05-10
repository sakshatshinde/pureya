import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Disc3,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
// Removed Tooltip related imports

const placeholder =
  "https://static.wikia.nocookie.net/kpop/images/a/af/VIVIZ_Voyage_digital_album_cover.webp";

export interface PlayerControlsProps {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  repeatMode?: "off" | "all" | "one";
  currentTrackInfo?: {
    id: string;
    title: string;
    artist: string;
    albumArtUrl?: string;
  };
  currentTime?: number; // in seconds
  duration: number; // in seconds
  volume?: number; // 0-100
  isMuted?: boolean;
  onPlayPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onSeek?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onMuteToggle?: () => void;
}

const formatTime = (timeInSeconds: number = 0): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function PlayerControls({
  isPlaying = false,
  isShuffleActive = false,
  repeatMode = "off",
  currentTrackInfo = {
    id: "0",
    title: "Song Title Placeholder",
    artist: "Artist Name",
    albumArtUrl: placeholder,
  },
  currentTime = 60,
  duration = 210,
  volume = 0,
  isMuted = false,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onShuffleToggle,
  onRepeatToggle,
  onSeek,
  onVolumeChange,
  onMuteToggle,
}: PlayerControlsProps) {
  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = isMuted
    ? VolumeX
    : volume > 50
    ? Volume2
    : volume > 0
    ? Volume1
    : VolumeX;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <footer className="h-32 px-4 py-3 flex flex-col justify-between bg-background border-t border-border">
      <div className="flex items-center w-full">
        {/* Left: Track Info */}
        <div className="flex items-center space-x-3 w-[30%] min-w-[200px] flex-shrink-0">
          {currentTrackInfo.albumArtUrl ? (
            <img
              src={currentTrackInfo.albumArtUrl}
              alt={currentTrackInfo.title}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
              <Disc3 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate hover:underline cursor-pointer">
              {currentTrackInfo.title}
            </p>
            <p className="text-xs text-muted-foreground truncate hover:underline cursor-pointer">
              {currentTrackInfo.artist}
            </p>
          </div>
        </div>

        {/* Center: Playback Buttons & Progress */}
        <div className="flex flex-col items-center flex-grow mx-4">
          <div className="flex items-center justify-center space-x-2">
            {/* Shuffle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              data-active={isShuffleActive}
              onClick={onShuffleToggle}
              aria-label={`Shuffle ${isShuffleActive ? "(On)" : "(Off)"}`} // Add aria-label for accessibility
            >
              <Shuffle
                className={`h-4 w-4 ${
                  isShuffleActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
            </Button>

            {/* Skip Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={onSkipPrevious}
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5 text-foreground" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              variant="default"
              size="icon"
              className="w-10 h-10 rounded-full"
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-background text-background" />
              ) : (
                <Play className="h-5 w-5 fill-background text-background" />
              )}
            </Button>

            {/* Skip Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={onSkipNext}
              aria-label="Next track"
            >
              <SkipForward className="h-5 w-5 text-foreground" />
            </Button>

            {/* Repeat Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              data-active={repeatMode !== "off"}
              onClick={onRepeatToggle}
              aria-label={`Repeat ${
                repeatMode === "off"
                  ? "(Off)"
                  : repeatMode === "all"
                  ? "(All tracks)"
                  : "(Current track)"
              }`}
            >
              <RepeatIcon
                className={`h-4 w-4 ${
                  repeatMode !== "off"
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
            </Button>
          </div>
          <div className="flex items-center w-full gap-x-2 mt-1.5">
            <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentProgress]}
              max={100}
              step={0.1}
              className="flex-1 h-2 group"
              onValueChange={(valueArray) => onSeek?.(valueArray[0])}
              aria-label="Track progress"
            />
            <span className="text-xs text-muted-foreground w-10 text-left tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Other Controls */}
        <div className="flex items-center justify-end space-x-2 w-[30%] min-w-[180px] flex-shrink-0">
          {/* Mute/Unmute Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={onMuteToggle}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <VolumeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            className="w-[100px] h-2 group"
            onValueChange={(valueArray) => onVolumeChange?.(valueArray[0])}
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
