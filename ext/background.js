// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // URL changed, send a message to the popup to reload or update
    chrome.runtime.sendMessage({ action: "url_changed", tabId });
  }
});
