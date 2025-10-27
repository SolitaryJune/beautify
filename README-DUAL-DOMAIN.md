# 🌐 双域名支持说明

本项目支持同时在两个域名下访问：
- `beautify.gushao.club`
- `beautify.gushao.bond`

## 🎯 核心原理

使用 **相对路径 (Relative URLs)** 技术，让同一份构建产物可以在多个域名下正常工作。

## 🔧 关键配置

```toml
# config/production/config.toml
baseurl = "/"
relativeURLs = true
canonifyURLs = false
```

## 📦 构建与部署

### 构建
```bash
npm run build
```

### 部署到 Vercel
1. 创建项目，连接 Git 仓库
2. 构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`public`
3. 添加域名：
   - Settings → Domains → Add
   - 添加 `beautify.gushao.club`
   - 添加 `beautify.gushao.bond`

## ✅ 优势

- ✅ 一次构建，节省时间和资源
- ✅ 配置简单，易于维护
- ✅ 两个域名内容完全同步
- ✅ 无跨域问题
- ✅ 链接在各自域名下正常工作

## 📚 详细文档

- [部署指南](./DEPLOYMENT.md)
- [测试报告](./DUAL-DOMAIN-TEST.md)
