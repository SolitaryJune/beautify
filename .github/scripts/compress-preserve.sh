#!/bin/bash
# Git 历史压缩脚本 - 保留最近 N 次提交策略

set -e

# 配置 Git 用户信息（GitHub Actions 环境）
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

KEEP_COUNT="${KEEP_COMMITS_COUNT:-10}"

echo "::group::压缩 Git 历史 (保留策略)"

# 获取当前提交总数
TOTAL_COMMITS=$(git rev-list --count HEAD)
echo "当前提交总数: $TOTAL_COMMITS"

if [ "$TOTAL_COMMITS" -le "$KEEP_COUNT" ]; then
  echo "提交数量 ($TOTAL_COMMITS) 不超过保留数量 ($KEEP_COUNT)，跳过压缩"
  echo "::endgroup::"
  exit 0
fi

# 获取要保留的提交范围
echo "保留最近 $KEEP_COUNT 次提交"

# 获取截断点的 SHA (第 N+1 次提交)
if ! CUTOFF_SHA=$(git rev-parse HEAD~$KEEP_COUNT 2>/dev/null); then
  echo "::error::无法获取截断点 SHA"
  exit 1
fi

echo "截断点 SHA: $CUTOFF_SHA"

# 创建新的孤立分支保留最近的提交
TEMP_BRANCH="temp-compress-$(date +%s)"
git checkout -b "$TEMP_BRANCH"

# 使用 git rebase 保留最近的提交
# 创建一个新的根提交
git checkout --orphan new-root
git rm -rf .
git commit --allow-empty -m "Initial commit - Compressed history (原始提交数: $TOTAL_COMMITS)"

# 将最近的 N 次提交 cherry-pick 到新分支
echo "正在迁移最近 $KEEP_COUNT 次提交..."
COMMITS=$(git rev-list --reverse HEAD~$KEEP_COUNT..HEAD --ancestry-path)

for commit in $COMMITS; do
  if ! git cherry-pick "$commit"; then
    echo "::error::Cherry-pick 失败于提交 $commit"
    git cherry-pick --abort
    git checkout main
    git branch -D new-root "$TEMP_BRANCH"
    exit 1
  fi
done

# 切换回主分支并替换
git checkout main
OLD_MAIN=$(git rev-parse HEAD)
git reset --hard new-root

# 清理临时分支
git branch -D new-root "$TEMP_BRANCH"

# 验证结果
NEW_COMMITS=$(git rev-list --count HEAD)
echo "压缩后提交数: $NEW_COMMITS"

echo "::endgroup::"
