import { useState, useEffect } from "react";

export function useThemeSwitcher() {
  const [theme, setTheme] = useState("auto");

  useEffect(() => {
    // Load theme from chrome.storage
    chrome.storage.local.get(["theme"], (res) => {
      if (res.theme) {
        setTheme(res.theme);
      }
    });

    // Listen for storage changes
    const handleStorageChange = (changes, area) => {
      if (area === "local" && changes.theme) {
        setTheme(changes.theme.newValue || "auto");
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const themes = ["auto", "light", "dark"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    chrome.storage.local.set({ theme: nextTheme });
  };

  return { theme, toggleTheme };
}
