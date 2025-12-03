(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const addBtn = document.getElementById("add");
    const openSidePanelBtn = document.getElementById("open-sidepanel");
    const displayToggleBtn = document.getElementById("display-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const titleInput = document.getElementById("title");
    const urlInput = document.getElementById("url");

    function render(items) {
      grid.innerHTML = "";
      (items || []).forEach((item) => {
        const el = document.createElement("div");
        el.className = "item";
        const iconHtml = item.icon
          ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(
              item.title
            )}"/>`
          : escapeHtml((item.title && item.title[0]) || "?");
        el.innerHTML = `<div class="item-icon" aria-hidden="true">${iconHtml}</div><div class="item-title">${escapeHtml(
          item.title
        )}</div>`;

        const removeBtn = document.createElement("button");
        removeBtn.className = "item-remove";
        removeBtn.textContent = "✕";
        removeBtn.title = "Remove";
        el.appendChild(removeBtn);

        el.addEventListener("click", (e) => {
          // if clicked remove button, ignore navigation
          if (e.target.closest(".item-remove")) return;
          chrome.runtime.sendMessage({ type: "navigate", url: item.url });
          window.close();
        });

        // remove button
        removeBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          removeItem(item.id);
        });

        el.tabIndex = 0;
        el.setAttribute("role", "listitem");
        el.setAttribute("aria-label", item.title);
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            el.click();
          }
        });
        grid.appendChild(el);
      });
    }

    function escapeHtml(text) {
      return text
        ? text.replace(/[&<>"']/g, function (m) {
            return {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            }[m];
          })
        : "";
    }

    function generateId() {
      return "id_" + Math.random().toString(36).slice(2, 9);
    }

    function getFaviconForUrl(url) {
      try {
        const u = new URL(url);
        return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
      } catch (e) {
        return null;
      }
    }

    addBtn.addEventListener("click", () => {
      const title = titleInput.value && titleInput.value.trim();
      const url = urlInput.value && urlInput.value.trim();
      if (!title || !url) return alert("Title and URL required");
      const item = {
        id: generateId(),
        title,
        url,
        icon: getFaviconForUrl(url),
      };
      chrome.storage.local.get(["fab_items"], (res) => {
        const items = res && res.fab_items ? res.fab_items : [];
        items.unshift(item);
        chrome.storage.local.set({ fab_items: items }, () => {
          titleInput.value = "";
          urlInput.value = "";
          render(items);
        });
      });
    });

    if (openSidePanelBtn) {
      openSidePanelBtn.addEventListener("click", async () => {
        // If the browser supports the sidePanel API, open it; otherwise open a new tab
        if (
          chrome.sidePanel &&
          chrome.sidePanel.setOptions &&
          chrome.sidePanel.open
        ) {
          const queryOptions = { active: true, currentWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          const tabId = tab?.id;
          chrome.sidePanel.setOptions({ path: "sidepanel.html" }, () => {
            try {
              chrome.sidePanel.open({ tabId });
            } catch (err) {
              /* ignore errors */
            }
          });
        } else {
          chrome.tabs.create({ url: chrome.runtime.getURL("sidepanel.html") });
        }
      });
    }

    // initialize display toggle
    function updateDisplayButton(mode) {
      if (!displayToggleBtn) return;
      displayToggleBtn.textContent =
        mode === "dock" ? "Display: Dock" : "Display: FAB";
    }
    if (displayToggleBtn) {
      chrome.storage.local.get(["fab_display"], (res) => {
        const mode = res && res.fab_display ? res.fab_display : "fab";
        updateDisplayButton(mode);
      });
      displayToggleBtn.addEventListener("click", () => {
        chrome.storage.local.get(["fab_display"], (res) => {
          const current = res && res.fab_display ? res.fab_display : "fab";
          const next = current === "dock" ? "fab" : "dock";
          chrome.storage.local.set({ fab_display: next }, () =>
            updateDisplayButton(next)
          );
        });
      });
    }

    // theme handling
    function updateThemeButton(mode) {
      if (!themeToggleBtn) return;
      themeToggleBtn.textContent =
        mode === "dark"
          ? "Theme: Dark"
          : mode === "light"
          ? "Theme: Light"
          : "Theme: Auto";
    }

    function applyTheme(mode) {
      const root = document.documentElement;
      if (mode === "dark") root.setAttribute("data-theme", "dark");
      else if (mode === "light") root.setAttribute("data-theme", "light");
      else {
        // auto
        root.removeAttribute("data-theme");
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.setAttribute("data-theme", "dark");
        else root.removeAttribute("data-theme");
      }
    }

    if (themeToggleBtn) {
      chrome.storage.local.get(["fab_theme"], (res) => {
        const mode = res && res.fab_theme ? res.fab_theme : "auto";
        applyTheme(mode);
        updateThemeButton(mode);
      });
      themeToggleBtn.addEventListener("click", () => {
        chrome.storage.local.get(["fab_theme"], (res) => {
          const current = res && res.fab_theme ? res.fab_theme : "auto";
          const next =
            current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
          chrome.storage.local.set({ fab_theme: next }, () => {
            applyTheme(next);
            updateThemeButton(next);
          });
        });
      });
    }

    // react to system theme changes only when in auto mode
    if (window.matchMedia) {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", () => {
        chrome.storage.local.get(["fab_theme"], (res) => {
          const mode = res && res.fab_theme ? res.fab_theme : "auto";
          if (mode === "auto") applyTheme("auto");
        });
      });
    }

    // Update theme when saved from another place
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.fab_theme) {
        const newMode = changes.fab_theme.newValue || "auto";
        applyTheme(newMode);
        updateThemeButton(newMode);
      }
    });
    // apply theme in case storage changed since initial read
    chrome.storage.local.get(["fab_theme"], (res) => {
      const mode = res && res.fab_theme ? res.fab_theme : "auto";
      applyTheme(mode);
      updateThemeButton(mode);
    });

    function removeItem(id) {
      chrome.storage.local.get(["fab_items"], (res) => {
        const items =
          res && res.fab_items
            ? res.fab_items.filter((it) => it.id !== id)
            : [];
        chrome.storage.local.set({ fab_items: items }, () => render(items));
      });
    }

    // initial render
    chrome.storage.local.get(["fab_items"], (res) => {
      render(res && res.fab_items ? res.fab_items : []);
    });

    // listen storage changes
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.fab_items)
        render(changes.fab_items.newValue || []);
    });
  });
})();
