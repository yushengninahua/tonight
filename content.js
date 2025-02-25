// 监听来自background script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getSelection') {
    // 获取用户在网页中选中的文本
    const selectedText = window.getSelection().toString();
    sendResponse({text: selectedText});
  } else if (request.type === 'getFullContent') {
    // 获取页面全文内容
    const fullContent = document.body.innerText;
    sendResponse({text: fullContent});
  }
});

// 添加右键菜单点击事件监听
document.addEventListener('mouseup', function() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    // 可以在这里添加自定义的UI提示或操作
    chrome.runtime.sendMessage({
      type: 'textSelected',
      text: selectedText
    });
  }
});