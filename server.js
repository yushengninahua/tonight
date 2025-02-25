const express = require('express');
const app = express();
const port = 3000;

// 启用JSON解析中间件
app.use(express.json());

// 设置CORS头，允许扩展访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 处理分析请求的路由
app.post('/analyze', (req, res) => {
  try {
    const data = req.body;
    // 在这里添加数据分析逻辑
    console.log('Received data for analysis:', data);
    
    // 返回分析结果
    res.json({
      status: 'success',
      message: '分析完成',
      results: {
        // 这里添加实际的分析结果
        timestamp: new Date().toISOString(),
        analyzed: true
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: '分析过程中发生错误'
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});