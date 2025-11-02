chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ enabled: true }, (items) => {
    if (typeof items.enabled === 'undefined') {
      chrome.storage.local.set({ enabled: true });
    }
  });
});