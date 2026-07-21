# GitHub Pages 部署

生产文档域名：

- `https://docs.beautify.mp.juneover24.cn/`

## 发布流程

1. 提交文档或站点配置变更。
2. Pull Request 会执行依赖安装、lint 和 Hugo 构建。
3. `main` 更新后，Pages CI 构建 `public/` 并部署到 GitHub Pages。
4. 在文档域名验证首页、导航、静态资源、sitemap 和 404 页面。

## 本地验证

```bash
npm ci
npm run lint
npm run build
git diff --check
```

## 安全边界

- Workflow 仅在部署 job 使用 `pages: write` 和 `id-token: write`。
- Workflow 不重写 Git 历史、不 force-push、不自动删除运行记录。
- 仓库不使用生产密钥；禁止把私有项目目录或运行态配置复制到本仓库。
- 独立工具的一方源码、解密私钥和用户身份数据不属于本仓库内容。
