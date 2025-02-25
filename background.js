chrome.runtime.onInstalled.addListener(() => {
  console.log('TARE Chrome Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processData') {
    // 处理来自content script的数据
    console.log('Received data from content script:', message.data);
    // 在这里添加数据处理逻辑
    sendResponse({ status: 'success' });
  }
  return true;
});