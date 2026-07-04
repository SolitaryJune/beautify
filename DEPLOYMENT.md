# 新域名部署指南

本项目生产环境主域名：

- `docs.beautify.mp.juneover24.cn`

## 核心配置说明

生产环境使用固定站点地址，便于生成 sitemap、SEO 元数据和页面内绝对链接。

### 关键配置

- `baseurl = "https://docs.beautify.mp.juneover24.cn/"` - 生产站点地址
- `relativeURLs = false` - 生产环境不使用相对路径
- `canonifyURLs = false` - 不强制转换所有链接为绝对路径

## 本地构建

```bash
npm run build
```

构建产物在 `public/` 目录。

## Vercel 部署配置

1. 在 Vercel 中创建或打开项目
2. 添加自定义域名：
   - `docs.beautify.mp.juneover24.cn`
3. 构建设置：
   - **构建命令**：`npm run build`
   - **输出目录**：`public`
   - **安装命令**：`npm install`

## DNS 配置

将 `docs.beautify.mp.juneover24.cn` 的 DNS 指向部署平台。

### Vercel CNAME 示例

```text
类型: CNAME
名称: docs.beautify.mp
值: cname.vercel-dns.com
```

实际记录名称请以 DNS 服务商的填写规则为准。

## 验证部署

部署后检查：

1. 访问 `https://docs.beautify.mp.juneover24.cn/` 正常显示
2. 页面内导航链接保持在新域名下
3. CSS、JavaScript、图片和字体正常加载
4. 404 页面 5 秒后跳转到新域名首页
