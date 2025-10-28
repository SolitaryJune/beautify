#!/bin/bash
# Force Push 脚本 - 安全地推送压缩后的历史

set -e

echo "::group::Force Push 到远程仓库"

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "::error::当前不在 main 分支，无法推送"
  exit 1
fi

# 获取当前 commit SHA
CURRENT_SHA=$(git rev-parse HEAD)
echo "当前 commit SHA: $CURRENT_SHA"

# 推送前确认
echo "准备 force push 到 origin/main..."
echo "⚠️  这将覆盖远程仓库的历史"

# 配置 Git 用户信息（GitHub Actions 环境）
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

# 执行 force push
echo "执行 force push..."
if git push -f origin main; then
  echo "✓ Force push 成功"
  echo "新的远程 HEAD: $CURRENT_SHA"
  echo "pushed_sha=$CURRENT_SHA" >> $GITHUB_OUTPUT
else
  echo "::error::Force push 失败"
  exit 1
fi

# 推送所有标签（包括备份标签）
echo "推送标签..."
if git push origin --tags --force; then
  echo "✓ 标签推送成功"
else
  echo "::warning::标签推送失败，但主分支已更新"
fi

echo "::endgroup::"
