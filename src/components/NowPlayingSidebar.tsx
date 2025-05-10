import { Disc3, Music2, ListChecks, Info } from "lucide-react"; // Added ListChecks and Info for potential empty states
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust path
import { Separator } from "@/components/ui/separator"; // Adjust path
import { cn } from "@/lib/utils"; // For conditional class names

// Interface for individual items in the queue list
export interface QueueTrack {
  id: string; // Unique identifier for React key and potential interactions
  title: string;
  artist: string;
  albumArtUrl?: string; // URL for the small thumbnail
  duration: string; // Formatted string like "3:14"
  isPlaying?: boolean; // To highlight the currently playing track in the queue
  isNextUp?: boolean; // To highlight the next track if different from playing
}

// Interface for the detailed information of the currently selected/focused track
export interface DetailedTrackInfo {
  title: string;
  artist: string;
  album: string;
  year?: string; // e.g., "2024" or "2024.11.07"
  genre?: string; // Example: "K-Pop", "Electronic"
  composer?: string;
  filePath?: string; // Could be useful for 'show in folder' type actions
  formatDetails?: string; // e.g., "FLAC 44.1 kHz, 1088kbps, Stereo"
  durationSeconds?: number; // Raw duration in seconds for potential calculations
  lyrics?: string; // If you plan to show lyrics
  largeAlbumArtUrl?: string; // URL for the large album art
  // You can add more fields as needed from your Rust backend metadata
  // e.g., trackNumber, discNumber, bitrate, sampleRate, channels, etc.
}

// Interface for the summary text at the bottom of the sidebar
export interface QueueSummary {
  selectedText?: string; // e.g., "1 album, 22.4 MB, 3:03"
  queuedText?: string; // e.g., "Queued: 15:24"
}

// Props for the NowPlayingSidebar component
export interface NowPlayingSidebarProps {
  queueTracks?: QueueTrack[]; // List of tracks in the queue
  currentTrackDetails?: DetailedTrackInfo; // Detailed info of the track to display
  activeTrackId?: string; // ID of the track that is currently "active" or focused in the queue for details
  queueSummary?: QueueSummary; // Summary info for the footer

  // Callbacks (examples, you'll define based on Tauri interactions)
  onTrackSelect?: (trackId: string) => void; // When a track in the queue is clicked
  onClearQueue?: () => void;
  onRemoveFromQueue?: (trackId: string) => void;
}

export function NowPlayingSidebar({
  queueTracks,
  currentTrackDetails,
  activeTrackId, // You'd use this to highlight the selected track for details
  queueSummary,
  onTrackSelect,
}: NowPlayingSidebarProps) {
  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-border bg-background flex flex-col h-full overflow-hidden">
      {/* Section 1: "Queue" Heading */}
      <div className="p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Queue</h2>
      </div>

      {/* Section 2: Scrollable Queue List */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="h-full px-4">
          {queueTracks && queueTracks.length > 0 ? (
            <div className="space-y-1 pb-2">
              {queueTracks.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-muted cursor-pointer group",
                    track.id === activeTrackId && "bg-muted", // Highlight active track for details
                    track.isPlaying && "border-l-2 border-primary pl-[6px]" // Highlight playing track
                  )}
                  onClick={() => onTrackSelect?.(track.id)}
                >
                  {track.albumArtUrl ? (
                    <img
                      src={track.albumArtUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-sm mr-3 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted-foreground/10 rounded-sm mr-3 flex items-center justify-center flex-shrink-0">
                      <Music2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        track.isPlaying ? "text-primary" : "text-foreground"
                      )}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-3 flex-shrink-0">
                    {track.duration}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ListChecks className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Queue is Empty
              </p>
              <p className="text-xs text-muted-foreground">
                Add some tracks to get started.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Section 3: Bottom fixed content (Separator, Track Info, Footer) */}
      <div className="flex-shrink-0">
        <Separator className="mx-4 my-2" />

        {currentTrackDetails ? (
          <ScrollArea className="max-h-[calc(100vh*0.4)]">
            {" "}
            {/* Allow this part to scroll if content is too tall for small windows, adjust max-h as needed */}
            <div className="p-4 pt-2 space-y-3">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Track Information
              </h2>
              <div>
                <h3
                  className="text-xl font-semibold text-foreground truncate"
                  title={currentTrackDetails.title}
                >
                  {currentTrackDetails.title}
                </h3>
                <p
                  className="text-sm text-muted-foreground truncate"
                  title={currentTrackDetails.artist}
                >
                  {currentTrackDetails.artist}
                </p>
                <p
                  className="text-sm text-muted-foreground truncate"
                  title={currentTrackDetails.album}
                >
                  {currentTrackDetails.album}
                </p>
                {currentTrackDetails.year && (
                  <p className="text-xs text-muted-foreground">
                    {currentTrackDetails.year}
                  </p>
                )}
                {currentTrackDetails.genre && (
                  <p className="text-xs text-muted-foreground">
                    Genre: {currentTrackDetails.genre}
                  </p>
                )}
              </div>
              {currentTrackDetails.formatDetails && (
                <p className="text-xs text-muted-foreground">
                  {currentTrackDetails.formatDetails}
                </p>
              )}
              {/* You can add more fields here like composer, filePath etc. */}
              {currentTrackDetails.largeAlbumArtUrl ? (
                <img
                  src={currentTrackDetails.largeAlbumArtUrl}
                  alt={currentTrackDetails.title}
                  className="aspect-square w-full rounded-md object-cover mt-2 shadow-md"
                />
              ) : (
                <div className="aspect-square w-full bg-muted rounded-md flex items-center justify-center mt-2">
                  <Disc3 className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 pt-2 text-center min-h-[150px] flex flex-col items-center justify-center">
            {" "}
            {/* Placeholder if no track details */}
            <Info className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Select a track to see details.
            </p>
          </div>
        )}

        {(queueSummary?.selectedText || queueSummary?.queuedText) && (
          <div className="p-4 border-t border-border mt-auto">
            <p className="text-xs text-muted-foreground text-center">
              {queueSummary.selectedText}
              {queueSummary.selectedText && queueSummary.queuedText && " / "}
              {queueSummary.queuedText}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
