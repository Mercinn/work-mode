// Keeps track of recently closed tabs to prevent rapid re-closing
let recentlyClosedTabs = new Set();
let isActive = false;
let blacklist = [];

// Load initial settings
chrome.storage.local.get(['blacklist', 'isActive'], (result) => {
  blacklist = result.blacklist || [];
  isActive = result.isActive;
  if (isActive) {
    setupListeners();
  }
});

// Function to set up listeners
const setupListeners = () => {
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.tabs.onCreated.addListener(handleTabCreation);
};

// Function to remove listeners
const removeListeners = () => {
  chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  chrome.tabs.onCreated.removeListener(handleTabCreation);
};

// Handle tab updates
const handleTabUpdate = (tabId, changeInfo, tab) => {
  if (isActive && changeInfo.url && isBlacklisted(changeInfo.url)) {
    closeTab(tabId);
  }
};

// Handle new tabs
const handleTabCreation = (tab) => {
  if (isActive && tab.pendingUrl && isBlacklisted(tab.pendingUrl)) {
    closeTab(tab.id);
  }
};

// Function to check if the URL is blacklisted
const isBlacklisted = (url) => {
  return blacklist.some(site => url.includes(site));
};

// Function to close the tab
const closeTab = (tabId) => {
  if (!recentlyClosedTabs.has(tabId)) {
    recentlyClosedTabs.add(tabId);
    chrome.tabs.remove(tabId, () => {
      setTimeout(() => recentlyClosedTabs.delete(tabId), 3000);
    });
  }
};

// Listen for changes in the blacklist or activation status
chrome.storage.onChanged.addListener((changes) => {
  if (changes.isActive) {
    isActive = changes.isActive.newValue;
    if (isActive) {
      setupListeners();
    } else {
      removeListeners();
    }
  }
  if (changes.blacklist) {
    blacklist = changes.blacklist.newValue || [];
  }
});
