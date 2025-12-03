import { useAgents } from '../hooks';

function DefaultAgentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="twad:w-full twad:h-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v10a4 4 0 0 0 4 4h10" opacity="0.85"></path>
      <path d="M21 7V5a2 2 0 0 0-2-2H5" opacity="0.85"></path>
      <circle cx="12" cy="11.5" r="2.4"></circle>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="twad:w-3.5 twad:h-3.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function AgentCard({ agent, onRemove }) {
  return (
    <div className="twad:flex twad:items-center twad:gap-3 twad:p-3 twad:rounded-xl twad:border twad:border-white/[0.02] twad:bg-gradient-to-b twad:from-white/[0.012] twad:to-white/[0.006] twad:shadow-[0_6px_18px_rgba(3,6,15,0.25)] twad:transition-all twad:duration-[180ms] twad:ease-out hover:twad:-translate-y-1 hover:twad:shadow-[0_12px_34px_rgba(255,122,0,0.06)]">
      <div className="twad:w-12 twad:h-12 twad:min-w-[48px] twad:rounded-[10px] twad:flex twad:items-center twad:justify-center twad:bg-gradient-to-br twad:from-white/[0.02] twad:to-white/[0.01] twad:text-[#e6eef8] twad:font-bold twad:text-sm twad:relative twad:overflow-hidden">
        {agent.icon ? (
          <img src={agent.icon} alt={agent.title} className="twad:w-full twad:h-full twad:object-cover twad:rounded-[10px]" />
        ) : (
          <DefaultAgentIcon />
        )}
      </div>
      <div className="twad:flex-1 twad:flex twad:flex-col">
        <div className="twad:font-bold twad:text-[15px] twad:text-[#e6eef8]">{agent.title}</div>
        <div className="twad:text-xs twad:text-[#94a3b8] twad:mt-1">{agent.url}</div>
      </div>
      <div className="twad:flex twad:gap-2 twad:items-center">
        <button
          onClick={() => onRemove(agent)}
          className="twad:w-10 twad:h-9 twad:inline-grid twad:place-items-center twad:rounded-[9px] twad:bg-gradient-to-b twad:from-[#ff7a00]/[0.12] twad:to-[#ff7a00]/[0.06] twad:text-[#e6eef8] twad:border twad:border-[#ff7a00]/[0.14] twad:shadow-[0_6px_18px_rgba(255,122,0,0.06)] twad:cursor-pointer twad:transition-all twad:duration-[120ms] hover:twad:-translate-y-0.5 hover:twad:scale-[1.02] hover:twad:shadow-[0_14px_30px_rgba(255,122,0,0.12)]"
          title={`Remove ${agent.title}`}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export default function AgentList() {
  const { agents, removeAgent } = useAgents();

  return (
    <div className="twad:mt-2 twad:flex twad:flex-col twad:gap-2.5 twad:max-h-[320px] twad:overflow-auto twad:pr-1.5 twad:scrollbar-thin twad:scrollbar-thumb-white/[0.03] twad:scrollbar-track-transparent" aria-live="polite">
      {agents.length === 0 ? (
        <div className="twad:text-center twad:text-[#94a3b8] twad:text-sm twad:py-[30px] twad:px-1.5">
          No agents added yet. Add your first agent below!
        </div>
      ) : (
        agents.map((agent, index) => (
          <AgentCard key={index} agent={agent} onRemove={removeAgent} />
        ))
      )}
    </div>
  );
}
