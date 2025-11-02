(() => {
  const hideWatermarkCSS = `
        /* 针对所有可能的水印元素，使用更鲁棒的软隐藏策略 */
        .suite-clear[style*='background-image: url("'],
        .suite-clear[style*='data:image/png;base64'],
        .ssrWaterMark,
        /* 针对无 class/id 但有特定 style 属性的水印 */
        div[style*='position: fixed'][style*='pointer-events: none'][style*='height: 100%'][style*='width: 100%'][style*='background-image: url("data:image/png;base64,'],
        div[style*='position: fixed'][style*='pointer-events: none'][style*='height: 100%'][style*='width: 100%'][style*='background-repeat: repeat;'] {
            transform: scale(0) !important;
            height: 1px !important;
            width: 1px !important;
            overflow: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;

  let styleEl = null;

  const ensureStyle = () => {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-feishu-watermark-remover', 'true');
      styleEl.textContent = hideWatermarkCSS;
    }
    return styleEl;
  };

  const applyCSS = () => {
    const el = ensureStyle();
    if (!el.isConnected) {
      (document.head || document.documentElement).appendChild(el);
    }
    try { console.log('水印隐藏样式已注入（扩展启用）。'); } catch (e) {}
  };

  const removeCSS = () => {
    if (styleEl && styleEl.isConnected) {
      styleEl.remove();
    }
    try { console.log('水印隐藏样式已移除（扩展停用）。'); } catch (e) {}
  };

  const init = () => {
    chrome.storage.local.get({ enabled: true }, (items) => {
      if (items.enabled) {
        applyCSS();
      } else {
        removeCSS();
      }
    });
  };

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'TOGGLE_WATERMARK') {
      if (msg.enabled) applyCSS(); else removeCSS();
      sendResponse && sendResponse({ ok: true });
      return true;
    }
    return false;
  });

  init();
})();