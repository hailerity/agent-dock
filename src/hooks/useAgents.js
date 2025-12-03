import { useState, useEffect } from "react";

export function useAgents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Load agents from chrome.storage
    chrome.storage.local.get(["fab_items"], (res) => {
      if (res.fab_items) {
        setAgents(res.fab_items);
      }
    });

    // Listen for storage changes
    const handleStorageChange = (changes, area) => {
      if (area === "local" && changes.fab_items) {
        setAgents(changes.fab_items.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const addAgent = (agent) => {
    chrome.storage.local.get(["fab_items"], (res) => {
      const currentAgents = res.fab_items || [];
      const updatedAgents = [...currentAgents, agent];
      chrome.storage.local.set({ fab_items: updatedAgents });
    });
  };

  const removeAgent = (agentToRemove) => {
    const updatedAgents = agents.filter((a) => a !== agentToRemove);
    setAgents(updatedAgents);
    chrome.storage.local.set({ fab_items: updatedAgents });
  };

  return { agents, addAgent, removeAgent };
}
