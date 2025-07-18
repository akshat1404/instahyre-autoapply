chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.sync.set({ autoApplyEnabled: false });
});