#!/bin/bash
# 备份机制脚本 - 创建 Git 历史备份标签

set -e

echo "::group::创建备份标签"

# 生成带时间戳的备份标签名称
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"

echo "创建备份标签: $BACKUP_TAG"

# 创建标签
git tag "$BACKUP_TAG" HEAD

# 推送标签到远程
if git push origin "$BACKUP_TAG"; then
  echo "✓ 备份标签已创建并推送: $BACKUP_TAG"
  echo "backup_tag=$BACKUP_TAG" >> $GITHUB_OUTPUT
else
  echo "::error::备份标签推送失败"
  exit 1
fi

# 输出恢复命令供参考
echo ""
echo "如需恢复，请使用以下命令:"
echo "  git fetch origin"
echo "  git reset --hard $BACKUP_TAG"
echo "  git push -f origin main"

echo "::endgroup::"
