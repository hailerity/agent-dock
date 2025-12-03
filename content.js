// content.js
(() => {
  if (window.__FAB_PANEL_INJECTED) return;
  window.__FAB_PANEL_INJECTED = true;

  const createFab = () => {
    const fab = document.createElement("button");
    fab.id = "fab-panel-button";
    fab.setAttribute("aria-label", "Open panel");
    fab.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>`; // plus icon
    document.body.appendChild(fab);
    return fab;
  };

  const createPanel = () => {
    const panel = document.createElement("div");
    panel.id = "fab-panel-container";
    panel.innerHTML = `
<div id="fab-panel-inner">
<div id="fab-panel-header">
  <strong>Quick Links</strong>
  <div style="display:flex;gap:8px;align-items:center">
    <button id="fab-panel-open-sidepanel" aria-label="Open side panel" title="Open side panel">▤</button>
    <button id="fab-panel-close" aria-label="Close">✕</button>
  </div>
</div>
<div id="fab-panel-grid" role="list"></div>
</div>
`;
    document.body.appendChild(panel);
    return panel;
  };

  const createDock = () => {
    const dock = document.createElement('div');
    dock.id = 'fab-dock-container';
    dock.className = 'hidden';
    document.body.appendChild(dock);
    return dock;
  };

  const renderGrid = (items) => {
    const grid = document.getElementById("fab-panel-grid");
    if (!grid) return;
    grid.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("button");
      card.className = "fab-item";
      card.type = "button";
      card.dataset.url = item.url;
      card.title = item.title;
      const iconHtml = item.icon ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.title)}"/>` : escapeHtml((item.title && item.title[0]) || "?");
      card.innerHTML = `<div class="fab-item-icon" aria-hidden="true">${iconHtml}</div><div class="fab-item-title">${escapeHtml(
        item.title
      )}</div><div class="fab-item-chevron" aria-hidden="true">›</div>`;
      card.setAttribute("aria-label", item.title);
      card.tabIndex = 0;
      card.setAttribute("role", "listitem");

      card.addEventListener("click", (e) => {
        e.preventDefault();
        // Tell background to navigate this tab
        chrome.runtime.sendMessage({ type: "navigate", url: item.url });
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });

      grid.appendChild(card);
    });
    // If panel is open and size changes, reposition to stay anchored
    if (panel.classList.contains("open")) positionPanel();
  };

  const renderDock = (items) => {
    const dock = document.getElementById('fab-dock-container');
    if (!dock) return;
    dock.innerHTML = '';
    (items || []).forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'fab-dock-item';
      btn.type = 'button';
  btn.title = item.title;
  btn.setAttribute('aria-label', item.title);
  btn.setAttribute('role', 'button');
      const iconHtml = item.icon ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.title)}"/>` : escapeHtml((item.title && item.title[0]) || '?');
      btn.innerHTML = iconHtml;
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation(); chrome.runtime.sendMessage({ type: 'navigate', url: item.url });
      });
      dock.appendChild(btn);
    });
  };

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }

  const fab = createFab();
  const panel = createPanel();
  const dock = createDock();
  // bind close button inside panel
  const closeBtn = panel.querySelector("#fab-panel-close");
  if (closeBtn)
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePanel();
    });
  const openSidePanelBtn = panel.querySelector("#fab-panel-open-sidepanel");

  // if (openSidePanelBtn) openSidePanelBtn.addEventListener('click', (e) => { e.stopPropagation(); chrome.runtime.sendMessage({ type: 'open_sidepanel' }); });
  if (openSidePanelBtn)
    openSidePanelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chrome.runtime.sendMessage({ type: "open_sidepanel" });
    });

  function positionPanel() {
    const offset = 8; // space between FAB and panel
    const fabRect = fab.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const panelWidth = panelRect.width || 360; // fallback width
    const panelHeight = panelRect.height || 220;

    // Prefer to show above the FAB (panel bottom aligns with fab.top)
    let top = fabRect.top - panelHeight - offset;
    let left = fabRect.right - panelWidth; // align right edge of panel with right edge of FAB
    let origin = "bottom right";

    // If the panel would be off the top of the viewport, show below FAB instead
    if (top < 8) {
      top = fabRect.bottom + offset;
      origin = "top right";
    }

    // Constrain left to stay in viewport
    const minLeft = 8;
    const maxLeft = window.innerWidth - panelWidth - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    panel.style.top = `${Math.round(top)}px`;
    panel.style.left = `${Math.round(left)}px`;
    panel.style.transformOrigin = origin;
  }

  const scrollOptions = { capture: true, passive: true };
  const openPanel = () => {
    positionPanel();
    panel.classList.add("open");
    // reposition while open if window scrolls/resizes
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, scrollOptions);
  };
  const closePanel = () => {
    panel.classList.remove("open");
    window.removeEventListener("resize", positionPanel);
    window.removeEventListener("scroll", positionPanel, scrollOptions);
  };

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.contains("open");
    if (isOpen) closePanel();
    else openPanel();
  });

  document.addEventListener("click", (e) => {
    // close panel when clicking outside
    if (!panel.contains(e.target) && !fab.contains(e.target)) closePanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  // Load items from storage and render
  chrome.storage.local.get(["fab_items", "fab_display"], (res) => {
    const items = res && res.fab_items ? res.fab_items : [];
    renderGrid(items);
    renderDock(items);
    // show/hide based on display mode
    const mode = (res && res.fab_display) ? res.fab_display : 'fab';
    if (mode === 'dock') {
      fab.style.display = 'none';
      const dock = document.getElementById('fab-dock-container');
      if (dock) dock.classList.remove('hidden');
      panel.classList.remove('open');
    } else {
      fab.style.display = '';
      const dock = document.getElementById('fab-dock-container');
      if (dock) dock.classList.add('hidden');
    }
  });

  // Listen for storage changes to update panel dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.fab_items) {
      const items = changes.fab_items.newValue || [];
      renderGrid(items);
      renderDock(items);
    }
    if (area === 'local' && changes.fab_display) {
      const mode = changes.fab_display.newValue || 'fab';
      if (mode === 'dock') {
        fab.style.display = 'none';
        panel.classList.remove('open');
        const dock = document.getElementById('fab-dock-container'); if (dock) dock.classList.remove('hidden');
      } else {
        fab.style.display = '';
        const dock = document.getElementById('fab-dock-container'); if (dock) dock.classList.add('hidden');
      }
    }
  });
})();
