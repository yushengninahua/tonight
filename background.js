// 监听扩展安装或更新事件
chrome.runtime.onInstalled.addListener(function() {
  // 初始化存储的用户偏好设置
  chrome.storage.local.set({
    defaultStyle: 'simple',
    defaultFontSize: 24,
    defaultBold: false
  });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getSelectedText') {
    // 获取当前标签页中选中的文本
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'getSelection'}, function(response) {
        sendResponse(response);
      });
    });
    return true; // 保持消息通道开放
  }
});