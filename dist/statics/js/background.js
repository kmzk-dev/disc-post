chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSettings') {
    chrome.tabs.create({ url: 'setting.html' });
    sendResponse({ status: 'ok' });
  }
});