import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomBar } from "./components/BottomBar";
import "./App.css";

const AlbumPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Albums</h1>
  </div>
);

const SettingsPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Settings</h1>
  </div>
);

function App() {
  // Use rust to hydrate this data
  const currentTrackCount = 0;
  const currentTotalDuration = "00:00:00";

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow pb-14">
          <Routes>
            <Route path="/" element={<AlbumPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <BottomBar
          trackCount={currentTrackCount}
          totalDuration={currentTotalDuration}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
