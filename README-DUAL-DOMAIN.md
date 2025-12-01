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

## 🧹 自动清理功能

本项目配置了 GitHub Actions 自动清理功能，用于保持仓库整洁：

- ✅ **Workflow Runs 清理**：自动删除旧的 Actions 运行记录，保留最近 10 次
- ⚠️ **Git 历史压缩**（默认禁用）：可选的 Git 历史压缩功能

### 配置说明

清理功能通过环境变量控制，详见 [清理配置文档](./.github/docs/cleanup-configuration.md)。

**默认配置**：

- Workflow Runs 清理：✅ 已启用
- Git 历史压缩：❌ 已禁用（需要显式启用）

⚠️ **重要提示**：Git 历史压缩是危险操作，启用前请阅读 [风险说明](./.github/docs/cleanup-risks.md)。

## 📚 详细文档

- [部署指南](./DEPLOYMENT.md)
- [测试报告](./DUAL-DOMAIN-TEST.md)
- [清理配置](./.github/docs/cleanup-configuration.md)
- [风险说明](./.github/docs/cleanup-risks.md)
