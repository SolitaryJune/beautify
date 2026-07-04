# 新域名支持说明

本项目当前生产域名：

- `docs.beautify.mp.juneover24.cn`

## 关键配置

```toml
# config/production/config.toml
baseurl = "https://docs.beautify.mp.juneover24.cn/"
relativeURLs = false
canonifyURLs = false
```

## 构建与部署

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
   - Settings -> Domains -> Add
   - 添加 `docs.beautify.mp.juneover24.cn`

## 自动清理功能

本项目配置了 GitHub Actions 自动清理功能，用于保持仓库整洁：

- **Workflow Runs 清理**：自动删除旧的 Actions 运行记录，保留最近 10 次
- **Git 历史压缩**（默认禁用）：可选的 Git 历史压缩功能

清理功能通过环境变量控制，详见 [清理配置文档](./.github/docs/cleanup-configuration.md)。

## 详细文档

- [部署指南](./DEPLOYMENT.md)
- [测试报告](./DUAL-DOMAIN-TEST.md)
- [清理配置](./.github/docs/cleanup-configuration.md)
- [风险说明](./.github/docs/cleanup-risks.md)
