# 双域名部署指南

本项目已配置为**一次构建，支持多个域名访问**：
- `beautify.gushao.club`
- `beautify.gushao.bond`

## 核心配置说明

项目使用**相对路径 (relativeURLs)**，这样同一份构建产物可以在多个域名下正常工作，无需为每个域名单独构建。

### 关键配置
- `baseurl = "/"` - 使用根路径
- `relativeURLs = true` - 生产环境启用相对路径
- `canonifyURLs = false` - 不强制转换为绝对路径

## 本地构建

```bash
npm run build
```

一次构建即可，产物在 `public/` 目录。

## Vercel 部署配置

### 单项目多域名（推荐）

1. 在 Vercel 中创建一个项目
2. 添加两个自定义域名：
   - `beautify.gushao.club`
   - `beautify.gushao.bond`
3. 构建设置：
   - **构建命令**：`npm run build`
   - **输出目录**：`public`
   - **安装命令**：`npm install`

两个域名会指向同一份构建产物，完全兼容。

## DNS 配置

确保两个域名的 DNS 都正确指向 Vercel：

### beautify.gushao.club
```
类型: CNAME
名称: beautify
值: cname.vercel-dns.com
```

### beautify.gushao.bond
```
类型: CNAME
名称: beautify
值: cname.vercel-dns.com
```

## 验证部署

部署后检查：

1. ✅ 访问 `https://beautify.gushao.club` - 应该正常显示
2. ✅ 访问 `https://beautify.gushao.bond` - 应该正常显示
3. ✅ 检查页面内的链接 - 应该都是相对路径（如 `/docs/about/`）
4. ✅ 测试导航和内部链接 - 在两个域名下都应该正常工作
5. ✅ 检查静态资源加载 - CSS、JS、图片等应该正常加载

## 注意事项

### ✅ 优点
- 一次构建，节省资源
- 配置简单，易于维护
- 两个域名完全同步，不会出现内容不一致

### ⚠️ SEO 考虑
如果两个域名内容完全相同，搜索引擎可能认为是重复内容。建议：

1. **选择主域名**：例如 `beautify.gushao.club` 作为主域名
2. **301 重定向**（可选）：将 `.bond` 重定向到 `.club`
3. **Canonical 标签**（可选）：在模板中添加 canonical 指向主域名

### 🔧 如果需要域名特定配置

如果将来需要为不同域名显示不同内容，可以：
- 在模板中使用 `{{ .Site.BaseURL }}` 判断当前域名
- 或者使用 JavaScript 检测 `window.location.hostname`

## 测试命令

本地测试相对路径是否正常工作：

```bash
# 启动本地服务器
npm start

# 访问 http://localhost:1313
# 检查页面源代码，确认链接是相对路径
```
