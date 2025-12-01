# Git 历史压缩风险说明

⚠️ **重要警告**：Git 历史压缩是一个危险操作，会对仓库和协作者产生重大影响。请仔细阅读本文档后再决定是否启用。

## 主要风险

### 1. 协作者需要重新克隆仓库

**影响**：所有协作者的本地仓库将与远程仓库不同步。

**后果**：
- 协作者无法正常 pull 或 push
- 会看到大量冲突和错误
- 必须删除本地仓库并重新克隆

**协作者操作指南**：
```bash
# 备份本地未提交的更改
git stash

# 删除本地仓库
cd ..
rm -rf <repository-name>

# 重新克隆
git clone <repository-url>
cd <repository-name>

# 如果有本地更改，需要手动重新应用
```

### 2. Pull Requests 失效

**影响**：所有现有的 Pull Requests 将无法合并。

**后果**：
- PR 中的提交 SHA 不再存在
- 无法进行代码审查对比
- 需要关闭并重新创建 PR

**建议**：
- 在压缩历史前合并或关闭所有 PR
- 通知所有贡献者暂停提交 PR

### 3. 历史追溯信息丢失

**影响**：无法追溯代码的完整演变历史。

**后果**：
- `git blame` 信息不完整
- 无法查看某个功能的完整开发历史
- 调试时难以找到引入 bug 的提交
- 丢失详细的 commit message

**示例**：
```bash
# 压缩前：可以看到完整历史
git log --oneline
# a1b2c3d Fix bug in authentication
# d4e5f6g Add user login feature
# g7h8i9j Initial commit

# 压缩后（squash 策略）：只有一个提交
git log --oneline
# x1y2z3w Compressed history - Original commits: 3
```

### 4. 违反 Git 最佳实践

**影响**：破坏 Git 分布式版本控制的核心原则。

**后果**：
- 失去版本控制的主要优势
- 难以进行代码审计
- 不符合开源项目规范
- 可能违反某些合规要求

### 5. 备份和恢复复杂性

**影响**：虽然有备份机制，但恢复过程仍然复杂。

**后果**：
- 需要手动干预
- 可能需要协调多个协作者
- 恢复过程中可能丢失新的提交

## 适用场景

Git 历史压缩仅适用于以下场景：

### ✅ 适合使用

1. **个人项目**
   - 只有你一个人维护
   - 不需要详细的历史记录
   - 仓库大小是主要问题

2. **实验性项目**
   - 临时测试项目
   - 不需要长期维护
   - 历史记录不重要

3. **清理敏感信息后**
   - 已经从历史中移除敏感数据
   - 需要确保敏感信息完全删除
   - 已通知所有协作者

### ❌ 不适合使用

1. **团队协作项目**
   - 多人同时开发
   - 有活跃的 Pull Requests
   - 需要代码审查历史

2. **开源项目**
   - 有外部贡献者
   - 需要保留贡献历史
   - 遵循开源最佳实践

3. **生产环境项目**
   - 需要审计追踪
   - 有合规要求
   - 需要详细的变更历史

4. **有重要历史的项目**
   - 长期维护的项目
   - 历史记录有价值
   - 需要追溯 bug 来源

## 替代方案

在启用 Git 历史压缩前，考虑以下替代方案：

### 1. Git LFS（Large File Storage）

适用于大文件导致的仓库膨胀：
```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.zip"
```

### 2. 清理特定文件

使用 `git filter-branch` 或 `BFG Repo-Cleaner` 删除特定大文件：
```bash
# 使用 BFG
bfg --delete-files "large-file.zip"
```

### 3. 仅清理 Workflow Runs

保留 Git 历史，只清理 Actions 运行记录：
```yaml
env:
  CLEANUP_WORKFLOW_RUNS: 'true'
  CLEANUP_GIT_HISTORY: 'false'
```

### 4. 定期归档

创建归档分支保存旧历史：
```bash
git checkout -b archive/2024
git push origin archive/2024
```

## 安全措施

如果决定启用 Git 历史压缩，请遵循以下安全措施：

### 1. 提前通知

- 📢 通知所有协作者
- 📅 设定具体的执行时间
- 📝 提供详细的操作指南

### 2. 完整备份

```bash
# 创建完整备份
git clone --mirror <repository-url> backup-$(date +%Y%m%d)

# 或导出为 bundle
git bundle create backup-$(date +%Y%m%d).bundle --all
```

### 3. 测试验证

- 在 fork 或测试仓库中先测试
- 验证备份恢复流程
- 确认所有脚本正常工作

### 4. 选择合适时机

- 🕐 选择低活跃时段
- ✅ 确保没有进行中的 PR
- ✅ 确保所有协作者已提交更改

### 5. 监控执行

- 👀 实时监控 Actions 日志
- 📊 验证清理结果
- 🔍 检查备份标签

## 恢复流程

### 自动恢复

系统会在 force push 失败时自动尝试回滚：
```yaml
- name: 自动回滚
  if: steps.force-push.outcome == 'failure'
  run: .github/scripts/rollback.sh "${{ steps.backup.outputs.backup_tag }}"
```

### 手动恢复

如果需要手动恢复：

```bash
# 1. 获取备份标签
git fetch origin
git tag -l "backup-*"

# 2. 查看备份标签详情
git show backup-20241028-120000

# 3. 恢复到备份点
git reset --hard backup-20241028-120000

# 4. 强制推送恢复远程
git push -f origin main

# 5. 通知所有协作者重新克隆
```

### 协作者恢复步骤

通知协作者执行以下步骤：

```bash
# 1. 保存本地更改
git stash save "Before history cleanup"

# 2. 获取最新远程状态
git fetch origin

# 3. 强制重置到远程状态
git reset --hard origin/main

# 4. 清理本地分支
git clean -fd

# 5. 恢复本地更改（如果需要）
git stash pop
```

## 监控和审计

### 检查清理结果

```bash
# 查看提交数量
git rev-list --count HEAD

# 查看备份标签
git tag -l "backup-*"

# 查看最近的提交
git log --oneline -10

# 检查仓库大小
du -sh .git
```

### 审计日志

清理操作会在以下位置留下记录：
- GitHub Actions 日志
- Git 备份标签
- Commit message（包含原始统计信息）

## 常见问题

### Q: 压缩后能恢复完整历史吗？

A: 可以从备份标签恢复，但需要手动操作。备份标签会保留压缩前的完整历史。

### Q: 压缩历史能减少多少仓库大小？

A: 取决于历史中的文件变更。如果历史中有大文件被删除，可以显著减小。如果只是提交数量多，效果有限。

### Q: 可以只压缩部分历史吗？

A: 可以，使用 `preserve` 策略并设置 `KEEP_COMMITS_COUNT` 保留最近的提交。

### Q: 压缩后 GitHub Issues 和 PR 中的提交引用会怎样？

A: 引用会失效，显示为无效的 SHA。这是无法避免的副作用。

### Q: 可以撤销压缩操作吗？

A: 可以使用备份标签恢复，但需要所有协作者重新同步。

## 总结

Git 历史压缩是一个**高风险操作**，应该：

- ✅ 仅在必要时使用
- ✅ 充分评估影响
- ✅ 做好完整备份
- ✅ 通知所有相关人员
- ✅ 选择合适时机
- ❌ 不要在生产环境轻易使用
- ❌ 不要在团队项目中随意使用
- ❌ 不要在有活跃 PR 时使用

**推荐**：优先使用 Workflow Runs 清理，这是安全且有效的方式。只有在充分理解风险并做好准备的情况下，才启用 Git 历史压缩。

## 相关资源

- [Git 官方文档 - 重写历史](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
- [GitHub 文档 - 删除敏感数据](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git LFS](https://git-lfs.github.com/)
