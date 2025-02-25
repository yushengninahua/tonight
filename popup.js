// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.getElementById('textInput');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const fontSizeInput = document.getElementById('fontSize');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const boldText = document.getElementById('boldText');
  let currentStyle = 'simple';

  // 添加总结功能
  summarizeBtn && summarizeBtn.addEventListener('click', async function() {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      // 从content script获取页面全文
      chrome.tabs.sendMessage(tab.id, {type: 'getFullContent'}, async function(response) {
        if (response && response.text) {
          // 发送到服务器进行总结
          const result = await fetch('http://localhost:3000/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: response.text})
          });

          if (!result.ok) {
            throw new Error('服务器响应错误');
          }

          const data = await result.json();
          if (data.summary) {
            textInput.value = data.summary;
          } else {
            throw new Error('未获取到总结内容');
          }
        }
      });
    } catch (error) {
      console.error('总结失败:', error);
      alert('总结失败，请稍后重试');
    }
  });

  // 样式配置
  const styles = {
    simple: {
      background: '#FFFFFF',
      text: '#000000',
      font: '思源黑体'
    },
    dark: {
      background: '#000000',
      text: '#FFFFFF',
      font: '思源黑体'
    },
    warm: {
      background: '#F5E6D3',
      text: '#2C1810',
      font: '思源黑体'
    }
  };

  // 监听字号变化
  fontSizeInput.addEventListener('input', function() {
    fontSizeValue.textContent = this.value + 'px';
  });

  // 监听样式选择
  document.querySelectorAll('.style-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelector('.style-option.active').classList.remove('active');
      this.classList.add('active');
      currentStyle = this.dataset.style;
    });
  });

  // 生成图片
  generateBtn.addEventListener('click', function() {
    const text = textInput.value.trim();
    if (!text) {
      alert('请输入文字内容');
      return;
    }

    const style = styles[currentStyle];
    const fontSize = parseInt(fontSizeInput.value);
    const fontWeight = boldText.checked ? 'bold' : 'normal';

    // 计算画布尺寸
    const maxWidth = 600;
    const padding = 40;
    const lineHeight = fontSize * 1.5;

    // 设置字体样式以测量文本
    ctx.font = `${fontWeight} ${fontSize}px ${style.font}, Roboto, sans-serif`;
    
    // 分行处理文本
    const lines = [];
    let currentLine = '';
    const words = text.split('');

    for (let word of words) {
      const testLine = currentLine + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth - padding * 2) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // 设置画布尺寸
    const canvasHeight = padding * 2 + lines.length * lineHeight + 30; // 额外添加30px用于水印
    canvas.width = maxWidth;
    canvas.height = canvasHeight;

    // 绘制背景
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制文本
    ctx.fillStyle = style.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line, index) => {
      const y = padding + (index + 0.5) * lineHeight;
      ctx.fillText(line, canvas.width / 2, y);
    });

    // 添加水印
    ctx.font = '12px Arial';
    ctx.fillStyle = style.text;
    ctx.globalAlpha = 0.5;
    ctx.textAlign = 'right';
    ctx.fillText('語生年崋的AI总结DeepSeek', canvas.width - padding, canvas.height - padding/2);
    ctx.globalAlpha = 1.0;

    // 启用下载按钮
    downloadBtn.disabled = false;
  });

  // 下载图片
  downloadBtn.addEventListener('click', function() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const link = document.createElement('a');
    link.download = `quote_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  // 移除旧的总结功能代码
  // 添加优化后的DeepSeek R1总结功能
  const deepseekBtn = document.getElementById('deepseekBtn');

  deepseekBtn.addEventListener('click', async function() {
    let text = textInput.value.trim();
    
    try {
      // 如果文本框为空，尝试获取页面选中的文本
      if (!text) {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await new Promise(resolve => {
          chrome.tabs.sendMessage(tab.id, {type: 'getFullContent'}, resolve);
        });
        
        if (response && response.text) {
          text = response.text;
        } else {
          throw new Error('请输入需要总结的文字内容或选择网页文本');
        }
      }

      this.disabled = true;
      this.textContent = '正在总结...';

      const response = await fetch('http://localhost:3000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let summary = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        try {
          const data = JSON.parse(chunk);
          if (data.summary) {
            summary = data.summary;
            textInput.value = summary;
          }
        } catch (e) {
          console.error('解析响应数据失败:', e);
        }
      }

      if (!summary) {
        throw new Error('未获取到有效的总结内容');
      }
    } catch (error) {
      console.error('总结失败:', error);
      alert(error.message || '总结失败，请稍后重试');
    } finally {
      this.disabled = false;
      this.textContent = 'DeepSeek R1总结';
    }
  });
});