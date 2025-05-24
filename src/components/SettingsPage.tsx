import { useEffect, useState, useRef } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  FolderOpen,
  X,
  Library,
  FileText,
  Github,
  Info,
  Copyleft,
  Fingerprint,
} from "lucide-react";
import tauriConf from "@/../src-tauri/tauri.conf.json";
import { open } from '@tauri-apps/plugin-dialog';
import { emit } from "@tauri-apps/api/event";

function SettingsPage() {
  const githubUrl = "https://github.com/sakshatshinde/pureya/";
  const appVersion = tauriConf.version;
  const appIdentifier = tauriConf.identifier;

  // Use a ref for the store instance
  const storeRef = useRef<InstanceType<typeof LazyStore> | null>(null);
  const [libraryPath, setLibraryPath] = useState("");
  const [scanOnStartup, setScanOnStartup] = useState(true);
  const [storeLoaded, setStoreLoaded] = useState(false);

  // Runs only once at mount
  useEffect(() => {
    async function loadSettings() {
      const storeInstance = new LazyStore('settings.json');
      storeRef.current = storeInstance;
      const path = await storeInstance.get("libraryPath");
      const scan = await storeInstance.get("scanOnStartup");
      if (typeof path === "string") setLibraryPath(path);
      if (typeof scan === "boolean") setScanOnStartup(scan);
      setStoreLoaded(true);
    }
    loadSettings();
  }, []);

  // Save settings to store when values change and store is loaded
  // This effect runs whenever libraryPath, scanOnStartup, or storeLoaded changes.
  // It waits until the store is loaded before saving.
  // It writes the current values of libraryPath and scanOnStartup to the store and persists them to disk.
  // This ensures that any changes the user makes are saved and will persist across app restarts.
  useEffect(() => {
    if (!storeLoaded || !storeRef.current) return;
    const save = async () => {
      await storeRef.current!.set("libraryPath", libraryPath);
      await storeRef.current!.set("scanOnStartup", scanOnStartup);
      await storeRef.current!.save();
    };
    save();
  }, [libraryPath, scanOnStartup, storeLoaded]);

  const handleLibrarySelectionClick = async () => {
    // Open a folder selection dialog using Tauri
    const selectedPath = await open({
      directory: true,
      multiple: false,
      title: 'Select your music folder',
    });
    if (typeof selectedPath === 'string') {
      setLibraryPath(selectedPath);

      // Notify the rust backend about lib path change and trigger a scan hopefully!
      emit('library-path-updated', selectedPath);
    }
  };

  // This simply clears the libraryPath state, which also triggers a save to the store.
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
              onCheckedChange={(checked) => setScanOnStartup(checked === true)}
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
