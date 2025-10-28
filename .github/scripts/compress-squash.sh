#!/bin/bash
# Git 历史压缩脚本 - 完全压缩策略

set -e

# 配置 Git 用户信息（GitHub Actions 环境）
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

echo "::group::压缩 Git 历史 (完全压缩策略)"

# 获取当前提交总数和统计信息
TOTAL_COMMITS=$(git rev-list --count HEAD)
FIRST_COMMIT=$(git rev-list --max-parents=0 HEAD)
LAST_COMMIT=$(git rev-parse HEAD)

echo "当前提交总数: $TOTAL_COMMITS"
echo "首次提交: $FIRST_COMMIT"
echo "最新提交: $LAST_COMMIT"

# 获取贡献者统计
CONTRIBUTORS=$(git log --format='%an' | sort -u | wc -l)
echo "贡献者数量: $CONTRIBUTORS"

# 创建孤立分支
TEMP_BRANCH="temp-squash-$(date +%s)"
echo "创建临时分支: $TEMP_BRANCH"

if ! git checkout --orphan "$TEMP_BRANCH"; then
  echo "::error::创建孤立分支失败"
  exit 1
fi

# 添加所有文件
git add -A

# 创建压缩提交，包含原始历史信息
COMMIT_MSG="Compressed history

原始提交统计:
- 总提交数: $TOTAL_COMMITS
- 贡献者数: $CONTRIBUTORS
- 首次提交: $FIRST_COMMIT
- 最新提交: $LAST_COMMIT
- 压缩时间: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

注意: 此提交包含了之前所有历史的完整代码状态"

if ! git commit -m "$COMMIT_MSG"; then
  echo "::error::创建压缩提交失败"
  git checkout main
  git branch -D "$TEMP_BRANCH" 2>/dev/null || true
  exit 1
fi

# 删除旧的 main 分支
echo "替换 main 分支..."
git branch -D main

# 重命名临时分支为 main
git branch -m main

# 验证结果
NEW_COMMITS=$(git rev-list --count HEAD)
echo "压缩后提交数: $NEW_COMMITS"

if [ "$NEW_COMMITS" -ne 1 ]; then
  echo "::warning::压缩后提交数不为 1，实际为 $NEW_COMMITS"
fi

echo "::endgroup::"
