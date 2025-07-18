// We'll use this for future extension if needed
chrome.runtime.onInstalled.addListener(() => {
  // Set default state
  chrome.storage.sync.set({ autoApplyEnabled: false });
});