import { AlbumView } from "@/components/AlbumView";
import { NowPlayingSidebar } from "@/components/NowPlayingSidebar";
import { PlayerControls } from "@/components/PlayerControls";

function Home() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <AlbumView />
        <NowPlayingSidebar />
      </div>

      {/* Bottom section: Player controls, sits at the bottom of the Home/AlbumPage */}
      {/* PlayerControls has its own defined height (e.g., h-30) */}
      <PlayerControls />
    </div>
  );
}

export default Home;
