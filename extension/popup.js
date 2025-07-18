document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusDiv = document.getElementById('status');

  // Load current state
  chrome.storage.sync.get(['autoApplyEnabled'], (result) => {
    const isEnabled = result.autoApplyEnabled || false;
    updateUI(isEnabled);
  });

  // Toggle button click handler
  toggleBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['autoApplyEnabled'], (result) => {
      const newState = !result.autoApplyEnabled;
      chrome.storage.sync.set({ autoApplyEnabled: newState }, () => {
        updateUI(newState);
        // Send message to content script to update state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'toggleAutoApply', 
              enabled: newState 
            });
          }
        });
      });
    });
  });

  function updateUI(isEnabled) {
    if (isEnabled) {
      statusDiv.textContent = 'AUTO-APPLY ENABLED';
      statusDiv.className = 'status on';
      toggleBtn.textContent = 'Disable Auto-Apply';
    } else {
      statusDiv.textContent = 'AUTO-APPLY DISABLED';
      statusDiv.className = 'status off';
      toggleBtn.textContent = 'Enable Auto-Apply';
    }
  }
});