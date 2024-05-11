const observer = new MutationObserver((mutations) => {
  // Check for significant changes, if necessary
  console.log("DOM content changed");
  // Notify the extension that the DOM has changed
  chrome.runtime.sendMessage({ action: "content_changed" });
});

// Observe body for changes
observer.observe(document.body, { childList: true, subtree: true });
