# 需求文档 - GitHub Actions 历史清理功能

## 简介

为 GitHub Actions 工作流添加自动清理功能，在每次构建成功后清理旧的 workflow runs 历史记录和 Git commit 历史，保持仓库整洁并减少存储空间占用。

## 需求

### 需求 1：清理 Workflow Runs 历史记录

**用户故事：** 作为仓库维护者，我希望自动清理旧的 workflow runs 记录，以便保持 Actions 页面整洁并减少存储占用。

#### 验收标准

1. WHEN 构建任务成功完成 THEN 系统 SHALL 自动触发清理旧的 workflow runs
2. WHEN 清理 workflow runs THEN 系统 SHALL 保留最近 10 次运行记录
3. WHEN 清理 workflow runs THEN 系统 SHALL 删除超过保留数量的旧记录
4. IF 清理失败 THEN 系统 SHALL 记录错误但不影响主构建流程
5. WHEN 清理执行 THEN 系统 SHALL 需要适当的 GitHub token 权限

### 需求 2：清理 Git Commit 历史（可选/危险操作）

**用户故事：** 作为仓库维护者，我希望能够压缩 Git 提交历史，以便减少仓库大小。

#### 验收标准

1. WHEN 启用历史压缩功能 THEN 系统 SHALL 保留最近 10 次有意义的提交
2. WHEN 压缩历史 THEN 系统 SHALL 只在主分支执行
3. WHEN 压缩历史 THEN 系统 SHALL 使用 force push 更新远程仓库
4. IF 是 Pull Request THEN 系统 SHALL NOT 执行历史压缩
5. WHEN 压缩历史前 THEN 系统 SHALL 创建备份标签以防数据丢失
6. WHEN 压缩历史 THEN 系统 SHALL 在 commit message 中包含原始提交数量信息

### 需求 3：安全性和可配置性

**用户故事：** 作为仓库维护者，我希望清理功能是安全且可配置的，以便根据需要调整行为。

#### 验收标准

1. WHEN 配置清理功能 THEN 系统 SHALL 允许通过环境变量控制保留数量
2. WHEN 配置清理功能 THEN 系统 SHALL 允许独立启用/禁用每种清理类型
3. WHEN 执行危险操作 THEN 系统 SHALL 要求明确的配置标志
4. WHEN 清理失败 THEN 系统 SHALL 提供清晰的错误信息
5. IF 权限不足 THEN 系统 SHALL 跳过清理并记录警告

### 需求 4：通知和日志

**用户故事：** 作为仓库维护者，我希望了解清理操作的执行情况，以便监控和审计。

#### 验收标准

1. WHEN 清理开始 THEN 系统 SHALL 输出清理前的记录/提交数量
2. WHEN 清理完成 THEN 系统 SHALL 输出清理后的记录/提交数量
3. WHEN 清理执行 THEN 系统 SHALL 记录删除的具体项目
4. IF 清理失败 THEN 系统 SHALL 输出详细的错误堆栈信息
5. WHEN 跳过清理 THEN 系统 SHALL 说明跳过原因

## ⚠️ 风险提示

**Git 历史压缩的风险：**
- 会导致所有协作者需要重新克隆仓库
- 会使现有的 Pull Requests 失效
- 可能丢失重要的历史追溯信息
- 违反 Git 分布式版本控制的最佳实践

**建议：**
- 仅在个人项目或明确需要的情况下使用
- 考虑使用 Git LFS 或其他方案处理大文件
- 优先使用 workflow runs 清理，谨慎使用 commit 历史压缩
