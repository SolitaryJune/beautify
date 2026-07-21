# JuneOver24 工具箱官方文档

本仓库是 [JuneOver24 工具箱](https://docs.beautify.mp.juneover24.cn/) 的公开文档站源码。

主要功能已迁入微信小程序。本站用于发布入口说明、工具概览、权限边界和服务状态链接，不保存生产凭据、用户数据或付费工具的一方明文实现。

## 公开入口

- 文档站：<https://docs.beautify.mp.juneover24.cn/>
- 工具域：<https://tools.beautify.mp.juneover24.cn/>
- 状态页：<https://status.beautify.mp.juneover24.cn/>

## 本地开发

```bash
npm ci
npm run lint
npm run build
```

构建产物位于 `public/`，由 GitHub Pages workflow 发布。

## 内容原则

- 工具和权限状态以微信小程序实时目录为准。
- 不在文档中承诺固定价格、永久权限或静态剩余名额。
- 受控网页工作区应从小程序进入，公开静态地址不是授权凭证。
- 禁止提交密钥、Token、账号凭据、用户数据或私有部署配置。
