import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Use Shadcn's Checkbox
import {
  FolderOpen,
  X,
  Library,
  FileText,
  Github,
  Info,
  Copyleft,
  Fingerprint,
} from "lucide-react"; // Added X, SettingsIcon, Library, RefreshCw
import tauriConf from "@/../src-tauri/tauri.conf.json";

function SettingsPage() {
  const githubUrl = "https://github.com/sakshatshinde/pureya/";
  const appVersion = tauriConf.version;
  const appIdentifier = tauriConf.identifier;

  const [libraryPath, setLibraryPath] = React.useState("");
  const [scanOnStartup, setScanOnStartup] = React.useState(true); // State for the checkbox

  const handleLibrarySelectionClick = () => {
    console.log("Browse button clicked - implement dialog opening");
    setLibraryPath("D:/Music"); // Simulate a folder selection
  };

  const handleClearPath = () => {
    setLibraryPath("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl space-y-8">
      <header className="mb-8 flex items-center space-x-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your application preferences.
          </p>
        </div>
      </header>

      {/* --- Music Library Section --- */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-3">
          <Library className="h-6 w-6 text-muted-foreground" />
          <div>
            <CardTitle>Music Library</CardTitle>
            <CardDescription>
              Manage folder paths and scanning options for your music
              collection.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="libraryPathInput">Selected Folder Path</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="libraryPathInput"
                type="text"
                value={libraryPath}
                readOnly
                placeholder="No folder selected"
                className="flex-grow"
              />
              <Button
                variant="outline"
                onClick={handleLibrarySelectionClick}
                aria-label="Browse for music folder"
              >
                <FolderOpen className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Browse</span>
              </Button>
              {libraryPath && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearPath}
                  aria-label="Clear selected path"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Click "Browse" to select your main music folder.
            </p>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="scanOnStartup"
              checked={scanOnStartup}
              onCheckedChange={(checked) => setScanOnStartup(checked === true)} // Ensure boolean value
            />
            <Label
              htmlFor="scanOnStartup"
              className="text-sm font-normal cursor-pointer"
            >
              Scan library automatically on startup
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start space-x-3">
          <Info className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
          <div>
            <CardTitle>About</CardTitle>
            <CardDescription>Version {appVersion}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            A minimal cross platform music player
            <br />
            Built with Rust, React, and Tauri
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-y-2 pt-4 text-sm">
          <div className="flex items-center">
            <Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{appIdentifier}</span>
          </div>

          <div className="flex items-center">
            <Github className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="select-all text-blue-500 leading-none">
              {githubUrl}
            </span>
          </div>

          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">GNU AGPLv3</span>
          </div>

          <div className="flex items-center">
            <Copyleft className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {new Date().getFullYear()} Sakshat Shinde
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SettingsPage;
