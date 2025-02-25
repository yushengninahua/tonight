const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// 添加请求体大小限制
app.use(express.json({ limit: '1mb' }));
app.use(cors());

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const DEEPSEEK_API_KEY = '23aeb5da-793c-4eda-1122-8eec47a001dd';
const TIMEOUT = 30000; // 30秒超时

app.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: '请提供要总结的文本内容' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: '文本内容过长，请限制在5000字以内' });
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-v3-241226',
          messages: [
            {
              role: 'system',
              content: '使用一个金句总结全文最核心的内容'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.6,
          stream: false,
          max_tokens: 1000
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API请求失败，状态码：${response.status}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API返回数据格式错误');
      }

      res.json({ summary: data.choices[0].message.content });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(error.status || 500).json({
      error: error.message || '总结生成失败，请稍后重试',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});