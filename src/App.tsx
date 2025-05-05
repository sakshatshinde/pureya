import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";

import "./App.css";
import { BottomBar } from "./components/BottomBar";

function App() {
  return (
    <main className="container">
      <BottomBar></BottomBar>
    </main>
  );
}

export default App;
