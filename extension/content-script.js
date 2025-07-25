let autoApplyEnabled = false;
let observer = null;
let initialIntervalId = null;
let startObserverId = null;

function createToggleUI() {
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'instahyre-autoapply-toggle';
  
  const toggleLabel = document.createElement('span');
  toggleLabel.className = 'toggle-label';
  toggleLabel.textContent = 'Auto-Apply:';
  
  const toggleSwitch = document.createElement('label');
  toggleSwitch.className = 'toggle-switch';
  
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  
  const toggleSlider = document.createElement('span');
  toggleSlider.className = 'toggle-slider';
  
  toggleSwitch.appendChild(toggleInput);
  toggleSwitch.appendChild(toggleSlider);
  
  toggleContainer.appendChild(toggleLabel);
  toggleContainer.appendChild(toggleSwitch);
  
  document.body.appendChild(toggleContainer);
  
  chrome.storage.sync.get(['autoApplyEnabled'], (result) => {
    autoApplyEnabled = result.autoApplyEnabled || false;
    toggleInput.checked = autoApplyEnabled;
    
    if (autoApplyEnabled) {
      startAutoApply();
    }
  });
  
  toggleInput.addEventListener('change', () => {
    autoApplyEnabled = toggleInput.checked;
    chrome.storage.sync.set({ autoApplyEnabled });
    
    if (autoApplyEnabled) {
      startAutoApply();
    } else {
      stopAutoApply();
    }
  });
}

function autoApply() { 
  const applyButton = document.querySelector('.btn.btn-lg.btn-primary.new-btn');
  
  if (applyButton) {
    const companyName = document.querySelector('.company-name.ng-binding')?.innerText || 'Unknown Company';
    console.log(`[Instahyre Auto-Apply] Applying to ${companyName}`);
    applyButton.click();
  }
}

function startAutoApply() {
  console.log('[Instahyre Auto-Apply] Starting automation');
  
  stopAutoApply();
  
  observer = new MutationObserver(() => {
    if (autoApplyEnabled) autoApply();
  });
  
  startObserverId = setInterval(() => {
    const elementToBeObserved = document.querySelector('.row.bar-actions.ng-scope');
    
    if (elementToBeObserved) {
      observer.observe(elementToBeObserved, {
        childList: true,
        subtree: true
      });
      autoApply();
      clearInterval(startObserverId);
      startObserverId = null;
    }
  }, 1000);
  
  initialIntervalId = setInterval(() => {
    const element = document.querySelector('#interested-btn');
    if (element) {
      clearInterval(initialIntervalId);
      initialIntervalId = null;
      element.click();
    }
  }, 500);
}

function stopAutoApply() {
  console.log('[Instahyre Auto-Apply] Stopping automation');
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  if (initialIntervalId) {
    clearInterval(initialIntervalId);
    initialIntervalId = null;
  }
  
  if (startObserverId) {
    clearInterval(startObserverId);
    startObserverId = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAutoApply') {
    autoApplyEnabled = request.enabled;
    
    if (autoApplyEnabled) {
      startAutoApply();
    } else {
      stopAutoApply();
    }
  }
});

if (window.location.hostname.includes('instahyre.com')) {
  createToggleUI();
}