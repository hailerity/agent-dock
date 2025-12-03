import { useState, useEffect } from "react";

export function useDisplayToggle() {
  const [displayMode, setDisplayMode] = useState("fab");

  useEffect(() => {
    // Load display mode from chrome.storage
    chrome.storage.local.get(["fab_display"], (res) => {
      if (res.fab_display) {
        setDisplayMode(res.fab_display);
      }
    });

    // Listen for storage changes
    const handleStorageChange = (changes, area) => {
      if (area === "local" && changes.fab_display) {
        setDisplayMode(changes.fab_display.newValue || "fab");
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const toggleDisplay = () => {
    const newMode = displayMode === "fab" ? "dock" : "fab";
    setDisplayMode(newMode);
    chrome.storage.local.set({ fab_display: newMode });
  };

  return { displayMode, toggleDisplay };
}
