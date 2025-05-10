import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListMusic, Settings as SettingsIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemConfig {
  href: string;
  icon: (isActive: boolean) => React.ReactElement;
  ariaLabel: string;
  label: string;
}

const navItemConfigsData: NavItemConfig[] = [
  {
    href: "/",
    icon: (isActive) => (
      <ListMusic
        className={cn(
          "h-5 w-5 shrink-0", // Added shrink-0 to prevent icon from shrinking
          isActive
            ? "text-blue-500"
            : "text-neutral-400 group-hover:text-neutral-100"
        )}
      />
    ),
    ariaLabel: "View Albums",
    label: "Albums",
  },
  {
    href: "/settings",
    icon: (isActive) => (
      <SettingsIcon
        className={cn(
          "h-5 w-5 shrink-0",
          isActive
            ? "text-blue-500"
            : "text-neutral-400 group-hover:text-neutral-100"
        )}
      />
    ),
    ariaLabel: "View Settings",
    label: "Settings",
  },
];

interface BottomBarProps {
  trackCount?: number;
  totalDuration?: string;
}

export function BottomBar({ trackCount, totalDuration }: BottomBarProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full h-10",
        "border-t border-neutral-700 bg-neutral-900 text-neutral-500 shadow-sm"
      )}
    >
      <div className="flex items-center justify-between h-full px-3 ">
        <div className="flex items-center gap-1">
          {navItemConfigsData.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "h-8 group flex items-center justify-start",
                  "focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:ring-offset-neutral-900",
                  // Dynamic padding/width for the button
                  isActive ? "pl-2 pr-3 py-1" : "p-1.5 w-8", // Adjusted padding for inactive, py-1 for active
                  "transition-all duration-300 ease-in-out overflow-hidden" // Added overflow-hidden to button
                )}
                aria-label={item.ariaLabel}
              >
                <Link to={item.href} className="flex items-center">
                  {" "}
                  {item.icon(isActive)}
                  <span
                    style={{
                      transitionProperty:
                        "opacity, max-width, margin-left, transform",
                    }}
                    className={cn(
                      "text-xs whitespace-nowrap transition-all duration-300 ease-in-out", // Keep transition-all as fallback
                      // Conditional classes for the text animation:
                      isActive
                        ? "max-w-[100px] opacity-100 ml-1.5 translate-x-0"
                        : "max-w-0 opacity-0 ml-0 -translate-x-1",
                      isActive ? "text-blue-500" : "text-transparent"
                    )}
                    aria-hidden={!isActive}
                  >
                    {item.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>

        {trackCount !== undefined && totalDuration && (
          <div className="text-xs text-neutral-400 select-none flex items-center">
            <Button
              variant="ghost"
              // Make button size consistent with other inactive icons (h-8, w-8)
              // p-1.5 should center a h-5 icon within a h-8 button nicely.
              className={cn(
                "mx-2 h-8 w-8 p-1.5 group", // Added group for hover state on icon
                "focus-visible:ring-1 focus-visible:ring-blue-500"
              )}
              aria-label="Refresh library"
            >
              <RefreshCw
                className={cn(
                  "h-5 w-5 shrink-0" // Consistent size and prevent shrinking
                )}
              />
            </Button>
            <span className="font-medium text-neutral-200">{trackCount}</span>
            <span className="mx-1">tracks</span>
            <span className="font-medium text-neutral-200">
              {totalDuration}
            </span>
            <span className="mx-1">total duration</span>
          </div>
        )}
      </div>
    </nav>
  );
}
