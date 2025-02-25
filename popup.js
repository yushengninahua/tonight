document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');
  const resultDiv = document.getElementById('result');

  startButton.addEventListener('click', async function() {
    try {
      // 发送消息给content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'startAnalysis' });
      
      // 显示结果
      resultDiv.textContent = response.result || 'Analysis completed';
    } catch (error) {
      resultDiv.textContent = 'Error: ' + error.message;
    }
  });
});