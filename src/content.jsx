import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";

// Panel Component - Shows agent icons stacked vertically above FAB
function Panel({ isOpen, onClose, agents, fabRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !fabRef.current || !panelRef.current) return;

    const positionPanel = () => {
      const fabRect = fabRef.current.getBoundingClientRect();
      const fabCenterX = fabRect.left + fabRect.width / 2;

      // Position panel above FAB, centered horizontally with the FAB
      // Use right positioning since FAB is on the right side
      panelRef.current.style.right = `${window.innerWidth - fabRect.right}px`;
      panelRef.current.style.bottom = `${
        window.innerHeight - fabRect.top + 8
      }px`;
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, { capture: true });
    };
  }, [isOpen, fabRef]);

  const handleNavigate = (url) => {
    chrome.runtime.sendMessage({ type: "navigate", url });
    onClose();
  };

  const handleOpenSidePanel = (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "open_sidepanel" });
  };

  if (!isOpen) return null;

  const iconContent = (agent) => {
    if (agent.icon) {
      return (
        <img
          src={agent.icon}
          alt={agent.title}
          className="twad:w-full twad:h-full twad:object-cover twad:rounded"
        />
      );
    }
    return (
      <span className="twad:text-xl twad:font-bold twad:text-gray-700">
        {agent.title?.[0] || "?"}
      </span>
    );
  };

  return (
    <div
      ref={panelRef}
      id="agent-dock-panel"
      className="twad:fixed twad:flex twad:flex-col-reverse twad:gap-3 twad:z-10000 twad:items-center"
    >
      {/* Open Side Panel Button at the top */}
      <button
        onClick={handleOpenSidePanel}
        className="twad:w-14 twad:h-14 twad:rounded-full twad:flex twad:items-center twad:justify-center twad:bg-white twad:transition-all hover:twad:scale-110 twad:animate-slide-up"
        style={{
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.1)",
          animationDelay: `${agents.length * 50}ms`,
          animationFillMode: "both",
        }}
        title="Open side panel"
        aria-label="Open side panel"
      >
        <span className="twad:text-2xl">▤</span>
      </button>

      {/* Agent Icons */}
      {agents.map((agent, index) => (
        <button
          key={index}
          onClick={() => handleNavigate(agent.url)}
          className="twad:w-14 twad:h-14 twad:rounded-full twad:flex twad:items-center twad:justify-center twad:bg-white twad:transition-all hover:twad:scale-110 twad:animate-slide-up"
          style={{
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.1)",
            animationDelay: `${(agents.length - 1 - index) * 50}ms`,
            animationFillMode: "both",
          }}
          title={agent.title}
          aria-label={agent.title}
        >
          {iconContent(agent)}
        </button>
      ))}
    </div>
  );
}

// FAB Button Component (using forwardRef to pass ref to parent)
const FabButton = React.forwardRef(({ onClick, isActive }, ref) => {
  return (
    <button
      ref={ref}
      id="fab-panel-button"
      onClick={onClick}
      className="twad:fixed twad:bottom-6 twad:right-6 twad:w-14 twad:h-14 twad:rounded-full twad:flex twad:items-center twad:justify-center twad:z-9999 twad:transition-all"
      style={{
        background: "white",
        boxShadow: isActive
          ? "0 4px 6px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.15), 0 0 0 2px rgba(0,0,0,0.05)"
          : "0 4px 6px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.1)",
      }}
      aria-label="Open panel"
    >
      <img
        src={chrome.runtime.getURL("icons/icon.png")}
        alt="Open panel"
        className="twad:w-9 twad:h-9 twad:rounded"
      />
    </button>
  );
});

// Dock Component
function Dock({ agents }) {
  const handleNavigate = (url) => {
    chrome.runtime.sendMessage({ type: "navigate", url });
  };

  const iconContent = (agent) => {
    if (agent.icon) {
      return (
        <img
          src={agent.icon}
          alt={agent.title}
          className="twad:w-full twad:h-full twad:object-cover"
        />
      );
    }
    return (
      <span className="twad:text-xl twad:font-bold">
        {agent.title?.[0] || "?"}
      </span>
    );
  };

  return (
    <div className="twad:fixed twad:bottom-6 twad:right-6 twad:flex twad:flex-col twad:gap-3 twad:z-9999">
      {agents.map((agent, index) => (
        <button
          key={index}
          onClick={() => handleNavigate(agent.url)}
          className="twad:w-14 twad:h-14 twad:rounded-full twad:flex twad:items-center twad:justify-center twad:bg-white twad:transition-all hover:twad:scale-110"
          style={{
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.1)",
          }}
          title={agent.title}
          aria-label={agent.title}
        >
          {iconContent(agent)}
        </button>
      ))}
    </div>
  );
}

// Main Content Component
export default function Content() {
  const [displayMode, setDisplayMode] = useState("fab");
  const [agents, setAgents] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const fabRef = useRef(null);

  useEffect(() => {
    // Load initial data
    chrome.storage.local.get(["fab_items", "fab_display"], (res) => {
      setAgents(res.fab_items || []);
      setDisplayMode(res.fab_display || "fab");
    });

    // Listen for storage changes
    const handleStorageChange = (changes, area) => {
      if (area === "local") {
        if (changes.fab_items) {
          setAgents(changes.fab_items.newValue || []);
        }
        if (changes.fab_display) {
          setDisplayMode(changes.fab_display.newValue || "fab");
          setIsPanelOpen(false); // Close panel when switching modes
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  useEffect(() => {
    // Close panel when clicking outside
    const handleClickOutside = (e) => {
      if (isPanelOpen) {
        const fabButton = document.getElementById("fab-panel-button");
        const panelElement = document.getElementById("agent-dock-panel");

        if (
          fabButton &&
          !fabButton.contains(e.target) &&
          panelElement &&
          !panelElement.contains(e.target)
        ) {
          setIsPanelOpen(false);
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isPanelOpen]);

  const handleFabClick = (e) => {
    e.stopPropagation();
    setIsPanelOpen(!isPanelOpen);
  };

  if (displayMode === "dock") {
    return <Dock agents={agents} />;
  }

  return (
    <>
      <FabButton ref={fabRef} onClick={handleFabClick} isActive={isPanelOpen} />
      <Panel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        agents={agents}
        fabRef={fabRef}
      />
    </>
  );
}

// Prevent multiple injections
if (!window.__AGENT_DOCK_INJECTED) {
  window.__AGENT_DOCK_INJECTED = true;

  // We will inject app after loading CSS to prevent FOUC
  const injectApp = () => {
    const reactRoot = document.createElement("div");
    reactRoot.id = "agent-dock-content-root";
    document.body.appendChild(reactRoot);

    createRoot(reactRoot).render(<Content />);
  };

  // Load CSS dynamically (CSS is already bundled via import in dev, but this ensures it's loaded in production)
  // The CSS file will be generated by Vite as assets/content.css
  const loadCSS = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("assets/content.css");
    link.onerror = () => console.warn("Content CSS failed to load");
    link.onload = () => {
      injectApp();
    };
    document.head.appendChild(link);
  };

  loadCSS();
}
