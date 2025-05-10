import { Disc3, Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust path
import { Separator } from "@/components/ui/separator"; // Adjust path

const placeholder =
  "https://static.wikia.nocookie.net/kpop/images/a/af/VIVIZ_Voyage_digital_album_cover.webp";

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArtUrl?: string;
  duration: string;
}

interface DetailedTrackInfo {
  title: string;
  artist: string;
  album: string;
  year?: string;
  formatDetails?: string;
  largeAlbumArtUrl?: string;
}

interface NowPlayingSidebarProps {
  playingTracks?: Track[];
  currentDetailedTrack?: DetailedTrackInfo;
}

const placeholderPlayingTracks: Track[] = [
  {
    id: "1",
    title: "Shhh!",
    artist: "VIVIZ (비비지)",
    duration: "3:14",
    albumArtUrl: placeholder,
  },
  {
    id: "2",
    title: "Cliché",
    artist: "VIVIZ (비비지)",
    duration: "3:36",
    albumArtUrl: placeholder,
  },
  {
    id: "3",
    title: "Full Moon",
    artist: "VIVIZ (비비지)",
    duration: "2:13",
    albumArtUrl: placeholder,
  },
  {
    id: "4",
    title: "Hypnotize",
    artist: "VIVIZ (비비지)",
    duration: "3:05",
    albumArtUrl: placeholder,
  },
  {
    id: "5",
    title: "Love & Tears",
    artist: "VIVIZ (비비지)",
    duration: "3:14",
    albumArtUrl: placeholder,
  },
  {
    id: "6",
    title: "PULL UP",
    artist: "VIVIZ (비비지)",
    duration: "2:55",
    albumArtUrl: placeholder,
  },
  {
    id: "7",
    title: "Blue Clue",
    artist: "VIVIZ (비비지)",
    duration: "3:17",
    albumArtUrl: placeholder,
  },
  {
    id: "8",
    title: "Love or Die",
    artist: "VIVIZ (비비지)",
    duration: "3:39",
    albumArtUrl: placeholder,
  },
  {
    id: "9",
    title: "Vanilla Sugar Killer",
    artist: "VIVIZ (비비지)",
    duration: "3:16",
    albumArtUrl: placeholder,
  },
  {
    id: "10",
    title: "Overdrive",
    artist: "VIVIZ (비비지)",
    duration: "3:31",
    albumArtUrl: placeholder,
  },
  {
    id: "11",
    title: "So Special",
    artist: "VIVIZ (비비지)",
    duration: "3:19",
    albumArtUrl: placeholder,
  },
];

const placeholderDetailedTrack: DetailedTrackInfo = {
  title: "Full Moon",
  artist: "VIVIZ (비비지)",
  album: "The 5th Mini Album 'VOYAGE'",
  year: "2024.11.07",
  formatDetails: "FLAC 44.1 kHz, 1088k, Stereo, 2:13",
  largeAlbumArtUrl: placeholder,
};

export function NowPlayingSidebar({
  playingTracks = placeholderPlayingTracks,
  currentDetailedTrack = placeholderDetailedTrack,
}: NowPlayingSidebarProps) {
  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-border bg-background flex flex-col h-full overflow-hidden">
      {/* Section 1: "Playing Tracks" Heading (fixed height) */}
      <div className="p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">
          Playing Tracks
        </h2>
      </div>

      {/* Section 2: Wrapper for the scrollable tracks list */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* ScrollArea takes full height of its parent (which is the flex-1 div) */}
        <ScrollArea className="h-full px-4">
          <div className="space-y-1 pb-2">
            {playingTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer group"
              >
                {track.albumArtUrl ? (
                  <img
                    src={track.albumArtUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-sm mr-3 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-sm mr-3 flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">
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
        </ScrollArea>
      </div>

      {/* Section 3: Bottom fixed content (Separator, Track Info, Footer) */}
      {/* This div takes its natural height and doesn't shrink. */}
      <div className="flex-shrink-0">
        <Separator className="mx-4 my-2" />

        {currentDetailedTrack && (
          <div className="p-4 pt-2 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Track Information
            </h2>
            <div>
              <h3 className="text-xl font-semibold text-foreground truncate">
                {currentDetailedTrack.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {currentDetailedTrack.artist}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {currentDetailedTrack.album}
              </p>
              {currentDetailedTrack.year && (
                <p className="text-xs text-muted-foreground">
                  {currentDetailedTrack.year}
                </p>
              )}
            </div>
            {currentDetailedTrack.formatDetails && (
              <p className="text-xs text-muted-foreground">
                {currentDetailedTrack.formatDetails}
              </p>
            )}
            {currentDetailedTrack.largeAlbumArtUrl ? (
              <img
                src={currentDetailedTrack.largeAlbumArtUrl}
                alt={currentDetailedTrack.title}
                className="aspect-square w-full rounded-md object-cover mt-2" // This defines a large part of this section's height
              />
            ) : (
              <div className="aspect-square w-full bg-muted rounded-md flex items-center justify-center mt-2">
                <Disc3 className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Selected: 1 album, 22.4 MB, 3:03 / Queued: 15:24
          </p>
        </div>
      </div>
    </aside>
  );
}
