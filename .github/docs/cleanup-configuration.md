# 清理功能配置指南

本文档说明如何配置 GitHub Actions 工作流的自动清理功能。

## 概述

清理功能包括两个主要部分：
1. **Workflow Runs 清理**：自动删除旧的 GitHub Actions 运行记录
2. **Git 历史压缩**（可选）：压缩 Git 提交历史以减少仓库大小

## 环境变量配置

所有配置通过环境变量控制，在 `.github/workflows/build.yml` 和 `.github/workflows/codeql-analysis.yml` 的 `cleanup` job 中设置。

### CLEANUP_WORKFLOW_RUNS

控制是否启用 Workflow Runs 清理。

- **类型**: 布尔值（字符串）
- **默认值**: `'true'`
- **可选值**: `'true'` 或 `'false'`
- **说明**: 启用后会自动删除超过保留数量的旧 workflow runs

**示例**:
```yaml
env:
  CLEANUP_WORKFLOW_RUNS: 'true'
```

### KEEP_RUNS_COUNT

设置要保留的最近 workflow runs 数量。

- **类型**: 数字（字符串）
- **默认值**: `'10'`
- **说明**: 保留最近 N 次运行记录，删除更早的记录

**示例**:
```yaml
env:
  KEEP_RUNS_COUNT: '10'
```

### CLEANUP_GIT_HISTORY

控制是否启用 Git 历史压缩（危险操作）。

- **类型**: 布尔值（字符串）
- **默认值**: `'false'`
- **可选值**: `'true'` 或 `'false'`
- **说明**: ⚠️ 启用后会重写 Git 历史，这是一个危险操作！

**示例**:
```yaml
env:
  CLEANUP_GIT_HISTORY: 'false'  # 默认禁用
```

### KEEP_COMMITS_COUNT

设置要保留的最近提交数量（仅在使用 `preserve` 策略时有效）。

- **类型**: 数字（字符串）
- **默认值**: `'10'`
- **说明**: 保留最近 N 次提交，删除更早的提交历史

**示例**:
```yaml
env:
  KEEP_COMMITS_COUNT: '10'
```

### GIT_CLEANUP_STRATEGY

选择 Git 历史压缩策略。

- **类型**: 字符串
- **默认值**: `'preserve'`
- **可选值**: 
  - `'preserve'`: 保留最近 N 次提交
  - `'squash'`: 将所有历史压缩为单个提交
- **说明**: 选择不同的压缩策略

**示例**:
```yaml
env:
  GIT_CLEANUP_STRATEGY: 'preserve'
```

## 配置示例

### 示例 1：仅清理 Workflow Runs（推荐）

```yaml
cleanup:
  env:
    CLEANUP_WORKFLOW_RUNS: 'true'
    CLEANUP_GIT_HISTORY: 'false'
    KEEP_RUNS_COUNT: '10'
```

这是最安全的配置，只清理 workflow runs，不触碰 Git 历史。

### 示例 2：启用 Git 历史压缩（保留策略）

```yaml
cleanup:
  env:
    CLEANUP_WORKFLOW_RUNS: 'true'
    CLEANUP_GIT_HISTORY: 'true'
    KEEP_RUNS_COUNT: '10'
    KEEP_COMMITS_COUNT: '10'
    GIT_CLEANUP_STRATEGY: 'preserve'
```

保留最近 10 次提交，删除更早的历史。

### 示例 3：完全压缩 Git 历史（激进）

```yaml
cleanup:
  env:
    CLEANUP_WORKFLOW_RUNS: 'true'
    CLEANUP_GIT_HISTORY: 'true'
    KEEP_RUNS_COUNT: '10'
    GIT_CLEANUP_STRATEGY: 'squash'
```

将所有历史压缩为单个提交。

## 启用/禁用清理功能

### 禁用所有清理

```yaml
cleanup:
  env:
    CLEANUP_WORKFLOW_RUNS: 'false'
    CLEANUP_GIT_HISTORY: 'false'
```

### 仅禁用 Git 历史压缩

```yaml
cleanup:
  env:
    CLEANUP_WORKFLOW_RUNS: 'true'
    CLEANUP_GIT_HISTORY: 'false'  # 保持默认值
```

## 权限要求

清理功能需要以下 GitHub Actions 权限：

```yaml
permissions:
  actions: write      # 删除 workflow runs
  contents: write     # Git 历史操作
```

这些权限已在工作流文件中配置。

## 执行条件

清理功能仅在以下条件下执行：
- ✅ 主分支（`main`）
- ✅ Push 事件或手动触发
- ❌ Pull Request（自动跳过）

## 监控和日志

### 查看清理报告

每次清理执行后，会在 GitHub Actions 的 Summary 页面生成报告，包含：
- Workflow Runs 清理状态
- Git 历史压缩状态（如果启用）
- 备份标签信息
- 错误信息（如果有）

### 查看详细日志

在 Actions 运行页面，展开 `cleanup` job 的各个步骤查看详细日志。

## 故障排除

### Workflow Runs 清理失败

**可能原因**:
- 权限不足
- API 限流

**解决方案**:
1. 检查 `permissions` 配置是否包含 `actions: write`
2. 等待一段时间后重试
3. 查看详细错误日志

### Git 历史压缩失败

**可能原因**:
- 权限不足
- 网络问题
- Git 操作冲突

**解决方案**:
1. 检查备份标签是否已创建
2. 使用备份标签手动恢复（见下文）
3. 查看详细错误日志

### 从备份恢复

如果 Git 历史压缩失败，可以使用备份标签恢复：

```bash
# 获取备份标签（在日志中查找）
git fetch origin
git tag -l "backup-*"

# 恢复到备份点
git reset --hard backup-YYYYMMDD-HHMMSS
git push -f origin main
```

## 最佳实践

1. **先在测试仓库验证**：在生产环境启用前，先在 fork 或测试仓库中验证
2. **保守配置**：优先使用 workflow runs 清理，谨慎启用 Git 历史压缩
3. **定期检查**：定期查看清理报告，确保功能正常运行
4. **保留足够历史**：不要将 `KEEP_COMMITS_COUNT` 设置得太小
5. **备份重要数据**：在启用 Git 历史压缩前，确保有完整备份

## 风险警告

请参阅 [风险说明文档](./cleanup-risks.md) 了解 Git 历史压缩的详细风险。

## 相关文档

- [风险说明](./cleanup-risks.md)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
