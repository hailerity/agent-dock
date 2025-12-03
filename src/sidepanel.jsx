import { createRoot } from "react-dom/client";
import { useState } from "react";
import AgentList from "./components/AgentList";
import { useAgents } from "./hooks";
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

export default function Sidepanel() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

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
      className="twad:min-h-screen twad:h-full twad:m-0 twad:font-sans twad:bg-[radial-gradient(1200px_400px_at_10%_10%,rgba(255,122,0,0.06),transparent_6%),linear-gradient(180deg,#071229_0%,#071421_60%)] twad:text-[#e6eef8] twad:flex twad:flex-col twad:p-6"
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div className="twad:w-full twad:max-w-3xl twad:mx-auto">
        {/* Header */}
        <div className="twad:flex twad:items-center twad:gap-4 twad:mb-6">
          <div className="twad:w-[64px] twad:h-[64px] twad:rounded-xl twad:bg-gradient-to-br twad:from-white/[0.02] twad:to-white/[0.01] twad:flex twad:items-center twad:justify-center twad:relative twad:overflow-hidden twad:border twad:border-white/[0.03]">
            <div className="twad:absolute twad:inset-0 twad:bg-[radial-gradient(circle_at_10%_20%,rgba(255,122,0,0.08),transparent_12%),linear-gradient(120deg,rgba(255,255,255,0.02),transparent_40%)] twad:mix-blend-screen"></div>
            <div className="twad:w-[42px] twad:h-[42px]">
              <Logo />
            </div>
          </div>
          <div className="twad:flex-1">
            <h1 className="twad:m-0 twad:text-2xl twad:tracking-[-0.3px] twad:font-bold">
              Agent Dock
            </h1>
            <p className="twad:text-sm twad:text-[#94a3b8] twad:mt-1">
              Manage your AI agents
            </p>
          </div>
        </div>

        {/* Add Form */}
        <div className="twad:flex twad:gap-3 twad:mb-6 twad:items-center">
          <div className="twad:flex-1 twad:flex twad:gap-2 twad:items-center twad:bg-white/[0.02] twad:p-3 twad:rounded-xl twad:border twad:border-white/[0.03] focus-within:twad:shadow-[0_8px_30px_rgba(255,122,0,0.06)] focus-within:twad:border-[#ff7a00]/[0.12] twad:transition-all">
            <input
              type="text"
              placeholder="Agent Title"
              aria-label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="twad:bg-transparent twad:border-0 twad:outline-0 twad:text-[#e6eef8] twad:text-sm twad:w-full placeholder:twad:text-[#9fb0c8] placeholder:twad:opacity-90"
            />
          </div>
          <div className="twad:flex-[1.5] twad:flex twad:gap-2 twad:items-center twad:bg-white/[0.02] twad:p-3 twad:rounded-xl twad:border twad:border-white/[0.03] focus-within:twad:shadow-[0_8px_30px_rgba(255,122,0,0.06)] focus-within:twad:border-[#ff7a00]/[0.12] twad:transition-all">
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
            className="twad:px-6 twad:h-12 twad:inline-flex twad:items-center twad:justify-center twad:gap-2 twad:rounded-xl twad:cursor-pointer twad:border-0 twad:font-bold twad:text-white twad:bg-gradient-to-br twad:from-[#ff7a00] twad:to-[#ff9a3b] twad:shadow-[0_6px_22px_rgba(255,122,0,0.18),0_0_18px_rgba(255,122,0,0.14)_inset] twad:transition-all twad:duration-[120ms] hover:twad:scale-105 active:twad:translate-y-px focus:twad:outline focus:twad:outline-[3px] focus:twad:outline-[#ff7a00]/[0.14]"
            title="Add agent"
          >
            <PlusIcon />
            <span>Add Agent</span>
          </button>
        </div>

        {/* Agent List */}
        <div className="twad:bg-gradient-to-b twad:from-white/[0.02] twad:to-white/[0.01] twad:rounded-[20px] twad:p-6 twad:border twad:border-white/[0.04] twad:shadow-[0_10px_30px_rgba(2,6,23,0.6)]">
          <h2 className="twad:text-lg twad:font-bold twad:mb-4 twad:text-[#e6eef8]">
            Your Agents
          </h2>
          <AgentList />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Sidepanel />);
