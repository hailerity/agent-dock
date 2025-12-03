// items-default.js
(function () {
  const itemsVersion = 'v4';

  const DEFAULT_ITEMS = [
    {
      id: "chatgpt",
      title: "ChatGPT",
      url: "https://chat.openai.com",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com",
    },
    {
      id: "gemini",
      title: "Gemini",
      url: "https://gemini.google.com",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com",
    },
    {
      id: "claude",
      title: "Claude",
      url: "https://claude.ai",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=claude.ai",
    },
    {
      id: "Grok",
      title: "Grok",
      url: "https://grok.com",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=grok.com",
    },
    {
      id: "Deepseek",
      title: "Deepseek",
      url: "https://deepseek.com",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=deepseek.com",
    },
    {
      id: "bing",
      title: "Bing Chat",
      url: "https://www.bing.com/chat",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=bing.com",
    },
    // {
    //   id: "perplexity",
    //   title: "Perplexity",
    //   url: "https://www.perplexity.ai",
    //   icon: "https://www.perplexity.ai/favicon.ico",
    // },
  ];

  // Initialize storage with defaults if empty
  chrome.storage?.local?.get(["fab_items", "fab_initialized", "fab_display"], (res) => {
    if (!res || res.fab_initialized !== itemsVersion) {
      chrome.storage.local.set({
        fab_items: DEFAULT_ITEMS,
        fab_initialized: itemsVersion,
        fab_display: 'fab',
        fab_theme: 'auto',
      });
    } else if (!res.fab_display) {
      // ensure there's a display setting
      chrome.storage.local.set({ fab_display: 'fab' });
    }
  });
})();
