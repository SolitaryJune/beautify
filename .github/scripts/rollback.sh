#!/bin/bash
# 回滚脚本 - 从备份标签恢复 Git 历史

set -e

BACKUP_TAG="$1"

if [ -z "$BACKUP_TAG" ]; then
  echo "::error::未提供备份标签"
  echo "用法: $0 <backup-tag>"
  exit 1
fi

echo "::group::回滚到备份标签: $BACKUP_TAG"

# 验证备份标签是否存在
if ! git rev-parse "$BACKUP_TAG" >/dev/null 2>&1; then
  echo "::error::备份标签 $BACKUP_TAG 不存在"
  echo "可用的备份标签:"
  git tag -l "backup-*"
  exit 1
fi

echo "找到备份标签: $BACKUP_TAG"

# 获取备份标签的 SHA
BACKUP_SHA=$(git rev-parse "$BACKUP_TAG")
echo "备份 SHA: $BACKUP_SHA"

# 重置到备份点
echo "重置到备份点..."
if ! git reset --hard "$BACKUP_TAG"; then
  echo "::error::重置失败"
  exit 1
fi

echo "✓ 本地仓库已重置到备份点"

# 配置 Git 用户信息
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

# Force push 恢复远程仓库
echo "恢复远程仓库..."
if git push -f origin main; then
  echo "✓ 远程仓库已恢复"
  echo "恢复的 SHA: $BACKUP_SHA"
else
  echo "::error::远程仓库恢复失败"
  exit 1
fi

# 输出当前状态
CURRENT_COMMITS=$(git rev-list --count HEAD)
echo "当前提交数: $CURRENT_COMMITS"

echo "::endgroup::"
echo "✓ 回滚成功完成"
