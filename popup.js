const statusEl = document.getElementById('status');
const iconEl = document.getElementById('toggleIcon');

let currentEnabled = true;

function updateUI(enabled) {
  currentEnabled = enabled;
  statusEl.textContent = enabled ? '已启用' : '已禁用';
  iconEl.src = enabled ? 'icons/switch_on.svg' : 'icons/switch_off.svg';
  const title = enabled ? '点击禁用水印消除' : '点击启用水印消除';
  iconEl.title = title;
  iconEl.setAttribute('aria-pressed', String(enabled));
  iconEl.classList.toggle('active', enabled);
  iconEl.classList.toggle('inactive', !enabled);
}

function broadcastToActiveTab(enabled) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || !tab.id) return;
      const url = tab.url || '';
      const isFeishu = /:\/\/[^/]*\.feishu\.cn\//.test(url);
      if (isFeishu) {
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_WATERMARK', enabled }, () => {});
      }
    });
  } catch (e) {}
}

function setEnabled(next) {
  chrome.storage.local.set({ enabled: next }, () => {
    updateUI(next);
    broadcastToActiveTab(next);
  });
}

function toggle() { setEnabled(!currentEnabled); }

chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  updateUI(enabled);
});

iconEl.addEventListener('click', toggle);
iconEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
  }
});