// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startAnalysis') {
    // 在这里添加页面分析逻辑
    const pageData = {
      title: document.title,
      url: window.location.href,
      // 添加更多需要分析的数据
    };

    // 发送数据给background script处理
    chrome.runtime.sendMessage({
      action: 'processData',
      data: pageData
    }, response => {
      if (response && response.status === 'success') {
        sendResponse({ result: 'Analysis completed successfully' });
      } else {
        sendResponse({ result: 'Analysis failed' });
      }
    });

    return true; // 保持消息通道开放
  }
});