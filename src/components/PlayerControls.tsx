// src/components/PlayerControls.tsx

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
import { Slider } from "@/components/ui/slider"; // Make sure Slider is imported
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const placeholder =
  "https://static.wikia.nocookie.net/kpop/images/a/af/VIVIZ_Voyage_digital_album_cover.webp";

export interface PlayerControlsProps {
  // Added export here
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
  onPlayPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onSeek?: (value: number) => void; // Expects a single number (percentage 0-100)
  onVolumeChange?: (value: number) => void; // Expects a single number (0-100)
  onMuteToggle?: () => void;
  // onLikeTrack?: () => void; // Assuming this is not used for now
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
    title: "Song Title Placeholder",
    artist: "Artist Name",
    albumArtUrl: placeholder,
  },
  currentTime = 60,
  duration = 210,
  volume = 75,
  isMuted = false,
  // Callbacks from props
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
    <TooltipProvider delayDuration={100}>
      <footer className="h-30 px-4 py-3 flex flex-col justify-between bg-background border-t border-border">
        {" "}
        {/* Adjusted height to match previous examples */}
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
            {/* Optional: Like button if you add onLikeTrack back */}
          </div>

          {/* Center: Playback Buttons & Progress */}
          <div className="flex flex-col items-center flex-grow mx-4">
            <div className="flex items-center justify-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                    data-active={isShuffleActive}
                    onClick={onShuffleToggle}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                    onClick={onSkipPrevious}
                  >
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
                    onClick={onPlayPause}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                    onClick={onSkipNext}
                  >
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
                    onClick={onRepeatToggle}
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
            <div className="flex items-center w-full gap-x-2 mt-1.5">
              <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentProgress]} // Value is always an array for Slider
                max={100}
                step={0.1}
                className="flex-1 h-2 group"
                onValueChange={(valueArray) => onSeek?.(valueArray[0])} // **FIX HERE**
              />
              <span className="text-xs text-muted-foreground w-10 text-left tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Other Controls */}
          <div className="flex items-center justify-end space-x-2 w-[30%] min-w-[180px] flex-shrink-0">
            {/* Optional: Queue button if you add it back */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={onMuteToggle}
                >
                  <VolumeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
            <Slider
              value={[isMuted ? 0 : volume]} // Value is always an array
              max={100}
              step={1}
              className="w-[100px] h-2 group"
              onValueChange={(valueArray) => onVolumeChange?.(valueArray[0])} // **FIX HERE**
            />
          </div>
        </div>
      </footer>
    </TooltipProvider>
  );
}
