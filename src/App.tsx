import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomBar } from "@/components/BottomBar";
import Home from "@/components/Home";
import SettingsPage from "@/components/SettingsPage";
import "./App.css";

function App() {
  const currentTrackCount = 0;
  const currentTotalDuration = "00:00:00";

  return (
    <BrowserRouter>
      <div className="flex flex-col h-[calc(100vh-10px)] bg-background text-foreground">
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
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
