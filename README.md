# TARE Chrome Extension

## 项目简介
TARE Chrome Extension是一个功能强大的Chrome浏览器扩展，旨在提供便捷的网页分析工具。

## 功能特点
- 一键启动网页分析
- 实时数据处理
- 用户友好的界面

## 技术架构
- 使用Manifest V3
- Service Worker作为后台服务
- Content Scripts进行页面交互
- 响应式popup界面设计

## 安装说明
1. 克隆项目到本地
2. 在Chrome浏览器中打开`chrome://extensions/`
3. 开启开发者模式
4. 点击"加载已解压的扩展程序"
5. 选择项目目录

## 使用方法
1. 点击Chrome工具栏中的扩展图标
2. 在弹出窗口中点击"Start Analysis"
3. 等待分析结果显示

## 开发指南
### 项目结构
- `manifest.json`: 扩展配置文件
- `popup.html/js`: 弹出窗口界面
- `background.js`: 后台服务工作者
- `content.js`: 页面内容脚本

### 本地开发
```bash
npm install
npm start
```

## 注意事项
- 确保Chrome浏览器版本支持Manifest V3
- 遵循Chrome Web Store发布规范
- 注意数据安全和隐私保护

## 贡献指南
欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证
ISC License