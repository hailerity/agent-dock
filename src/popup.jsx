import { createRoot } from "react-dom/client";
import { useState } from "react";
import AgentList from "./components/AgentList";
import {
  useThemeSwitcher,
  useDisplayToggle,
  useSidePanel,
  useAgents,
} from "./hooks";
import "./global.css";

function Logo() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="twad:w-full twad:h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb07a" />
          <stop offset="1" stopColor="#ff7a00" />
        </linearGradient>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="12"
        stroke="url(#g1)"
        strokeWidth="3.5"
        opacity="0.98"
      />
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="2"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="twad:w-full twad:h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="twad:w-full twad:h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h.01" />
      <path d="M3 12h.01" />
      <path d="M3 19h.01" />
      <path d="M8 5h13" />
      <path d="M8 12h13" />
      <path d="M8 19h13" />
    </svg>
  );
}

function PanelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="twad:w-full twad:h-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M9 3v18"></path>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="twad:w-3.5 twad:h-3.5"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="twad:w-6 twad:h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

export default function Popup() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const { theme, toggleTheme } = useThemeSwitcher();
  const { displayMode, toggleDisplay } = useDisplayToggle();
  const { openSidePanel } = useSidePanel();
  const { addAgent } = useAgents();

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      return;
    }

    const newAgent = {
      title: trimmedTitle,
      url: trimmedUrl,
      icon: null,
    };

    addAgent(newAgent);
    setTitle("");
    setUrl("");
  };

  return (
    <div
      className="twad:min-w-[420px] twad:h-full twad:m-0 twad:font-sans twad:bg-[radial-gradient(1200px_400px_at_10%_10%,rgba(255,122,0,0.06),transparent_6%),linear-gradient(180deg,#071229_0%,#071421_60%)] twad:text-[#e6eef8] twad:flex twad:items-center twad:justify-center twad:p-[1px]"
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div
        className="twad:w-full twad:rounded-[20px] twad:p-[18px] twad:relative twad:bg-gradient-to-b twad:from-white/[0.02] twad:to-white/[0.01] twad:shadow-[0_10px_30px_rgba(2,6,23,0.6),0_1px_0_rgba(255,255,255,0.02)_inset] twad:backdrop-blur-[8px] twad:backdrop-saturate-[120%] twad:border twad:border-white/[0.04] twad:overflow-hidden"
        role="dialog"
        aria-labelledby="dock-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="twad:flex twad:items-center twad:gap-3 twad:mb-3">
          <div className="twad:w-[52px] twad:h-[52px] twad:rounded-xl twad:bg-gradient-to-br twad:from-white/[0.02] twad:to-white/[0.01] twad:flex twad:items-center twad:justify-center twad:relative twad:overflow-hidden twad:border twad:border-white/[0.03]">
            <div className="twad:absolute twad:inset-0 twad:bg-[radial-gradient(circle_at_10%_20%,rgba(255,122,0,0.08),transparent_12%),linear-gradient(120deg,rgba(255,255,255,0.02),transparent_40%)] twad:mix-blend-screen"></div>
            <div className="twad:w-[34px] twad:h-[34px]">
              <Logo />
            </div>
          </div>
          <div className="twad:flex-1">
            <h1
              id="dock-title"
              className="twad:m-0 twad:text-base twad:tracking-[-0.2px] twad:font-bold"
            >
              Agent Dock
            </h1>
          </div>
          <div className="twad:flex">
            <button
              onClick={toggleTheme}
              className="twad:bg-transparent twad:border-0 twad:text-[#94a3b8] twad:font-bold twad:cursor-pointer twad:w-8 twad:h-8 hover:twad:text-[#e6eef8] twad:transition-colors"
              title={`Theme: ${theme}`}
            >
              <SunIcon />
            </button>
            <button
              onClick={toggleDisplay}
              className="twad:bg-transparent twad:border-0 twad:text-[#94a3b8] twad:font-bold twad:cursor-pointer twad:w-8 twad:h-8 hover:twad:text-[#e6eef8] twad:transition-colors"
              title={`Display: ${displayMode.toUpperCase()}`}
            >
              <ListIcon />
            </button>
            <button
              onClick={openSidePanel}
              className="twad:bg-transparent twad:border-0 twad:text-[#94a3b8] twad:font-bold twad:cursor-pointer twad:w-8 twad:h-8 hover:twad:text-[#e6eef8] twad:transition-colors"
              title="Open side panel"
            >
              <PanelIcon />
            </button>
          </div>
        </div>

        {/* Agent List */}
        <AgentList />

        {/* Footer / Form */}
        <div className="twad:flex twad:gap-2.5 twad:mt-3.5 twad:items-center">
          <div className="twad:flex-[0.9] twad:flex twad:gap-2 twad:items-center twad:bg-white/[0.02] twad:p-2.5 twad:rounded-xl twad:border twad:border-white/[0.03] focus-within:twad:shadow-[0_8px_30px_rgba(255,122,0,0.06)] focus-within:twad:border-[#ff7a00]/[0.12] twad:transition-all">
            <input
              type="text"
              placeholder="Title"
              aria-label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="twad:bg-transparent twad:border-0 twad:outline-0 twad:text-[#e6eef8] twad:text-sm twad:w-full placeholder:twad:text-[#9fb0c8] placeholder:twad:opacity-90"
            />
          </div>
          <div className="twad:flex-[1.3] twad:flex twad:gap-2 twad:items-center twad:bg-white/[0.02] twad:p-2.5 twad:rounded-xl twad:border twad:border-white/[0.03] focus-within:twad:shadow-[0_8px_30px_rgba(255,122,0,0.06)] focus-within:twad:border-[#ff7a00]/[0.12] twad:transition-all">
            <input
              type="text"
              placeholder="https://example.com"
              aria-label="Agent url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="twad:bg-transparent twad:border-0 twad:outline-0 twad:text-[#e6eef8] twad:text-sm twad:w-full placeholder:twad:text-[#9fb0c8] placeholder:twad:opacity-90"
            />
          </div>
          <button
            onClick={handleAdd}
            className="twad:w-10 twad:h-9 twad:inline-grid twad:place-items-center twad:rounded-xl twad:cursor-pointer twad:border-0 twad:font-bold twad:text-white twad:bg-gradient-to-br twad:from-[#ff7a00] twad:to-[#ff9a3b] twad:shadow-[0_6px_22px_rgba(255,122,0,0.18),0_0_18px_rgba(255,122,0,0.14)_inset] twad:transition-all twad:duration-[120ms] active:twad:translate-y-px focus:twad:outline focus:twad:outline-[3px] focus:twad:outline-[#ff7a00]/[0.14]"
            title="Add agent"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Popup />);
