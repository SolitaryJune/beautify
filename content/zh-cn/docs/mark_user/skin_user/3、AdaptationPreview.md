---
title: "三、适配预览 皮肤 | 图标等文件"
description: "作者 ｜ 孤傲"
lead: "作者 ｜ 孤傲"
date: 2021-08-19T08:49:31+00:00
lastmod: 2021-08-19T08:49:31+00:00
draft: false
images: []
menu:
  docs:
    parent: "skin_user"
    weight: 30
toc: true
---

### 适配预览 皮肤 | 图标等文件说明

使用关键词 **加密凭证 | 普通加密凭证**，`bdi` | `bds` | `it` 文件默认会读取预览图。部分 `skini` 文件可能读取不到原生预览图，建议适配。

## 皮肤 | 图标等文件 预览图适配

### 适配文件结构

```plaintext
bdi | bds | it | skini | skinb /
├── GuShao.png  （预览图）
├── demo.png
├── 文件夹2 （皮肤的 dark，light 或 res）
└── 文件3.png （图标）
```

**重要说明**：

- 文件夹的**第一层**必须包含 `GuShao.png`，否则无法使用预览图功能。
- 如果皮肤文件 **没有** `GuShao.png`，则会**自动读取** `demo.png` 作为预览图。
- 如果图标文件 **没有** `demo.png` 或 `GuShao.png`，则**不会显示预览图**。
