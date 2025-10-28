#!/bin/bash
# 配置管理脚本 - 加载和验证清理配置

set -e

echo "::group::加载清理配置"

# 设置默认值
export CLEANUP_GIT_HISTORY="${CLEANUP_GIT_HISTORY:-false}"
export KEEP_COMMITS_COUNT="${KEEP_COMMITS_COUNT:-10}"
export GIT_CLEANUP_STRATEGY="${GIT_CLEANUP_STRATEGY:-preserve}"

echo "配置信息:"
echo "  CLEANUP_GIT_HISTORY: $CLEANUP_GIT_HISTORY"
echo "  KEEP_COMMITS_COUNT: $KEEP_COMMITS_COUNT"
echo "  GIT_CLEANUP_STRATEGY: $GIT_CLEANUP_STRATEGY"

# 验证配置
if [[ "$CLEANUP_GIT_HISTORY" != "true" && "$CLEANUP_GIT_HISTORY" != "false" ]]; then
  echo "::error::无效的 CLEANUP_GIT_HISTORY 值: $CLEANUP_GIT_HISTORY (必须是 true 或 false)"
  exit 1
fi

if ! [[ "$KEEP_COMMITS_COUNT" =~ ^[0-9]+$ ]] || [ "$KEEP_COMMITS_COUNT" -lt 1 ]; then
  echo "::error::无效的 KEEP_COMMITS_COUNT 值: $KEEP_COMMITS_COUNT (必须是正整数)"
  exit 1
fi

if [[ "$GIT_CLEANUP_STRATEGY" != "preserve" && "$GIT_CLEANUP_STRATEGY" != "squash" ]]; then
  echo "::error::无效的 GIT_CLEANUP_STRATEGY 值: $GIT_CLEANUP_STRATEGY (必须是 preserve 或 squash)"
  exit 1
fi

echo "配置验证通过"
echo "::endgroup::"
