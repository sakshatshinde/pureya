import {
  Play,
  Pause, // For toggling play state
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1, // For repeat-one state
  Disc3,
  Volume2,
  Volume1,
  VolumeX, // For mute state
  Heart, // Example: for a like button
  ListMusic, // Example: for queue button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const placeholder =
  "https://static.wikia.nocookie.net/kpop/images/a/af/VIVIZ_Voyage_digital_album_cover.webp";

// Example props (manage state and handlers in Rust/React state)
interface PlayerControlsProps {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  repeatMode?: "off" | "all" | "one";
  currentTrackInfo?: {
    title: string;
    artist: string;
    albumArtUrl?: string;
  };
  currentTime?: number; // in seconds
  duration?: number; // in seconds
  volume?: number; // 0-100
  isMuted?: boolean;

  // Callbacks - these would be sent to Tauri/Rust
  onPlayPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onSeek?: (value: number) => void; // value in seconds or percentage
  onVolumeChange?: (value: number) => void;
  onMuteToggle?: () => void;
  onLikeTrack?: () => void; // Example
}

// Helper to format time (seconds to MM:SS)
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
    title: "Song Title Placeholder",
    artist: "Artist Name",
    albumArtUrl: placeholder,
  },
  currentTime = 60, // 1:00
  duration = 210, // 3:30
  volume = 75,
  isMuted = false,
}: // onPlayPause, onSkipNext, etc. would be passed here
PlayerControlsProps) {
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
    <TooltipProvider delayDuration={100}>
      <footer className="h-30 px-4 py-3 flex flex-col justify-between bg-background border-t border-border">
        {/* Top Row: Main controls and Track Slider */}
        <div className="flex items-center w-full">
          {/* Left: Track Info (approx 25-30%) */}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 w-8 h-8">
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Center: Playback Buttons (approx 40-50%) */}
          <div className="flex flex-col items-center flex-grow mx-4">
            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                    data-active={isShuffleActive}
                  >
                    <Shuffle
                      className={`h-4 w-4 ${
                        isShuffleActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shuffle {isShuffleActive ? "(On)" : "(Off)"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <SkipBack className="h-5 w-5 text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="w-10 h-10 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-background text-background" />
                    ) : (
                      <Play className="h-5 w-5 fill-background text-background" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause" : "Play"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <SkipForward className="h-5 w-5 text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                    data-active={repeatMode !== "off"}
                  >
                    <RepeatIcon
                      className={`h-4 w-4 ${
                        repeatMode !== "off"
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Repeat{" "}
                    {repeatMode === "off"
                      ? "(Off)"
                      : repeatMode === "all"
                      ? "(All)"
                      : "(One)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* Progress Bar & Time */}
            <div className="flex items-center w-full gap-x-2 mt-1.5">
              <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <Slider
                defaultValue={[currentProgress]}
                value={[currentProgress]} // Controlled component if you manage state
                max={100}
                step={0.1}
                className="flex-1 h-2 group" // h-2 for thinner slider
                // onValueChange={(value) => onSeek?.( (value[0]/100) * duration )}
              />
              <span className="text-xs text-muted-foreground w-10 text-left tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Other Controls (approx 25-30%) */}
          <div className="flex items-center justify-end space-x-2 w-[30%] min-w-[180px] flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ListMusic className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Queue</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <VolumeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Volume</p>
              </TooltipContent>
            </Tooltip>
            <Slider
              defaultValue={[volume]}
              value={[isMuted ? 0 : volume]} // Controlled component
              max={100}
              step={1}
              className="w-[100px] h-2 group" // h-2 for thinner slider
              // onValueChange={(value) => onVolumeChange?.(value[0])}
            />
          </div>
        </div>
      </footer>
    </TooltipProvider>
  );
}
