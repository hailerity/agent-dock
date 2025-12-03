chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg && msg.type === "navigate") {
    // If message comes from a content script, sender.tab exists
    const tabId = sender?.tab?.id;
    if (tabId) {
      chrome.tabs.update(tabId, { url: msg.url });
    } else {
      // If sent from popup (no sender.tab), update the active tab in current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) chrome.tabs.update(tabs[0].id, { url: msg.url });
      });
    }
  }
});
