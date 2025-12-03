export function useSidePanel() {
  const openSidePanel = async () => {
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
      window.close();
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL("sidepanel.html") });
    }
  };

  return { openSidePanel };
}
