# 实现计划 - GitHub Actions 历史清理功能

- [x] 1. 更新工作流权限配置


  - 在 `.github/workflows/build.yml` 中添加 `actions: write` 权限以支持删除 workflow runs
  - 在 `.github/workflows/build.yml` 中添加 `contents: write` 权限以支持 Git 历史操作
  - 确保权限配置遵循最小权限原则
  - _需求: 1.5, 2.3_




- [ ] 2. 实现 Workflow Runs 清理功能
  - [ ] 2.1 在 build.yml 中添加 cleanup job
    - 创建新的 `cleanup` job，依赖于 `build` 和 `deploy` job
    - 配置 job 仅在主分支的 push 事件中运行


    - 设置适当的 `runs-on` 和 `permissions`
    - _需求: 1.1, 1.2, 3.3_
  
  - [ ] 2.2 集成 workflow runs 清理 action
    - 使用 `Mattraks/delete-workflow-runs@v2` action


    - 配置 `keep_minimum_runs: 10` 保留最近 10 次记录
    - 配置 `retain_days: 0` 不按天数保留
    - 使用 `${{ secrets.GITHUB_TOKEN }}` 提供认证
    - _需求: 1.2, 1.3_


  
  - [ ] 2.3 添加清理前后的日志输出
    - 在清理前输出当前 workflow runs 数量

    - 在清理后输出剩余 workflow runs 数量


    - 使用 GitHub API 获取 runs 统计信息
    - _需求: 4.1, 4.2, 4.3_
  
  - [ ] 2.4 实现错误处理
    - 使用 `continue-on-error: true` 确保清理失败不影响主流程


    - 添加条件判断检查清理步骤的执行结果
    - 在失败时输出详细错误信息
    - _需求: 1.4, 3.4, 4.4_

- [ ] 3. 实现 Git 历史压缩功能（可选）
  - [x] 3.1 创建配置管理脚本


    - 在 `.github/scripts/cleanup-config.sh` 创建配置加载脚本
    - 定义环境变量：`CLEANUP_GIT_HISTORY`, `KEEP_COMMITS_COUNT`, `GIT_CLEANUP_STRATEGY`
    - 提供默认值：`CLEANUP_GIT_HISTORY=false`, `KEEP_COMMITS_COUNT=10`, `GIT_CLEANUP_STRATEGY=preserve`
    - 实现配置验证逻辑
    - _需求: 3.1, 3.2_
  


  - [ ] 3.2 实现备份机制
    - 创建 `.github/scripts/create-backup.sh` 脚本
    - 使用时间戳生成唯一的备份标签名称
    - 执行 `git tag backup-YYYYMMDD-HHMMSS HEAD`
    - 推送标签到远程仓库
    - 输出备份标签信息供后续恢复使用


    - _需求: 2.5_
  
  - [ ] 3.3 实现"保留最近 N 次提交"策略
    - 创建 `.github/scripts/compress-preserve.sh` 脚本
    - 使用 `git rev-parse HEAD~N` 获取截断点 SHA


    - 使用 `git rebase -i` 或 `git reset` 保留最近 N 次提交
    - 在 commit message 中记录原始提交数量
    - 实现交互式 rebase 的自动化处理
    - _需求: 2.1, 2.6_
  


  - [ ] 3.4 实现"完全压缩"策略
    - 创建 `.github/scripts/compress-squash.sh` 脚本
    - 使用 `git checkout --orphan` 创建孤立分支
    - 添加所有文件并创建单个提交

    - 在 commit message 中包含原始提交统计信息


    - 替换原主分支
    - _需求: 2.1, 2.6_
  
  - [x] 3.5 实现 force push 逻辑


    - 在压缩脚本中添加 `git push -f origin main`
    - 添加推送前的确认检查
    - 实现推送失败的错误处理
    - 输出推送结果和新的 commit SHA


    - _需求: 2.3_
  
  - [x] 3.6 集成 Git 历史压缩到 workflow

    - 在 cleanup job 中添加 Git 历史压缩步骤


    - 使用条件判断 `if: env.CLEANUP_GIT_HISTORY == 'true'`
    - 按顺序调用：配置加载 → 备份创建 → 历史压缩 → force push
    - 配置 `continue-on-error: true` 防止阻塞
    - _需求: 2.2, 3.3_
  


  - [ ] 3.7 实现压缩结果验证
    - 在压缩后使用 `git rev-list --count HEAD` 验证提交数量
    - 比较压缩前后的提交数量
    - 输出压缩统计信息

    - 如果验证失败，触发回滚逻辑


    - _需求: 4.2, 4.3_

- [ ] 4. 添加安全检查和条件控制
  - [ ] 4.1 实现分支检查
    - 添加条件 `if: github.ref == 'refs/heads/main'` 确保只在主分支执行


    - 添加条件 `if: github.event_name != 'pull_request'` 排除 PR
    - 在脚本中添加分支验证逻辑
    - _需求: 2.2, 2.4, 3.3_
  
  - [ ] 4.2 实现权限检查
    - 在脚本开始时检查 `GITHUB_TOKEN` 是否存在
    - 验证 token 是否具有必要的权限
    - 如果权限不足，输出警告并跳过清理
    - _需求: 1.5, 3.4_

  


  - [ ] 4.3 添加危险操作确认
    - 为 Git 历史压缩添加显式启用检查
    - 在执行前输出警告信息
    - 要求环境变量显式设置为 'true'


    - _需求: 3.3_

- [x] 5. 实现错误恢复机制


  - [x] 5.1 创建回滚脚本


    - 创建 `.github/scripts/rollback.sh` 脚本
    - 实现从备份标签恢复的逻辑
    - 使用 `git reset --hard <backup-tag>` 恢复
    - 执行 force push 恢复远程仓库
    - _需求: 3.4, 4.4_


  
  - [ ] 5.2 集成自动回滚逻辑
    - 在 Git 历史压缩步骤失败时触发回滚
    - 使用 `if: steps.compress.outcome == 'failure'` 条件
    - 调用回滚脚本恢复到备份点


    - 输出回滚结果和恢复的 commit SHA
    - _需求: 3.4, 4.4_

- [ ] 6. 添加日志和监控
  - [ ] 6.1 实现详细日志输出
    - 在每个关键步骤前后输出状态信息
    - 记录清理的具体项目（run IDs, commit SHAs）
    - 使用 GitHub Actions 的日志分组功能组织输出
    - 输出执行时间统计
    - _需求: 4.1, 4.2, 4.3_
  
  - [ ] 6.2 创建清理报告
    - 在 cleanup job 结束时生成汇总报告
    - 包含：删除的 runs 数量、压缩的 commits 数量、备份标签、执行时间
    - 使用 GitHub Actions 的 summary 功能展示报告
    - _需求: 4.2, 4.3_
  
  - [ ]* 6.3 添加失败通知
    - 在清理失败时创建 GitHub Issue 或发送通知
    - 包含错误详情和恢复建议
    - 使用 `actions/github-script` 创建 issue
    - _需求: 4.4, 4.5_

- [ ] 7. 更新 codeql-analysis.yml 工作流
  - [ ] 7.1 添加类似的 cleanup job
    - 复制 build.yml 中的 cleanup job 配置
    - 调整 job 依赖关系（依赖 analyze job）
    - 确保条件判断适用于 codeql 工作流
    - _需求: 1.1, 1.2_
  
  - [ ] 7.2 配置权限
    - 在 codeql-analysis.yml 顶层添加 permissions 配置
    - 添加 `actions: write` 和 `contents: write` 权限
    - 保留现有的 CodeQL 所需权限
    - _需求: 1.5_

- [ ] 8. 创建文档和使用说明
  - [ ] 8.1 创建配置文档
    - 在 `.github/docs/cleanup-configuration.md` 创建配置指南
    - 说明所有环境变量及其默认值
    - 提供配置示例
    - 说明如何启用/禁用各项清理功能
    - _需求: 3.1, 3.2_
  
  - [ ] 8.2 创建风险说明文档
    - 在配置文档中添加风险警告章节
    - 详细说明 Git 历史压缩的影响
    - 提供协作者的操作指南（重新克隆等）
    - 说明如何从备份恢复
    - _需求: 2.5, 3.3_
  
  - [ ] 8.3 更新主 README
    - 在 README 中添加清理功能的简要说明
    - 链接到详细配置文档
    - 添加徽章显示清理状态（可选）
    - _需求: 3.1_

- [ ]* 9. 测试和验证
  - [ ]* 9.1 在测试仓库中验证
    - Fork 当前仓库或创建测试仓库
    - 部署清理功能并触发执行
    - 验证 workflow runs 清理效果
    - 验证 Git 历史压缩效果（如果启用）
    - 测试错误场景和回滚机制
    - _需求: 所有需求_
  
  - [ ]* 9.2 性能测试
    - 测量清理任务的执行时间
    - 验证不会超时（设置 10 分钟超时）
    - 检查 API 调用次数是否在限制内
    - _需求: 1.4_
  
  - [ ]* 9.3 创建测试清单
    - 创建 `.github/docs/testing-checklist.md`
    - 列出所有需要验证的场景
    - 包含手动测试步骤
    - 记录测试结果
    - _需求: 所有需求_
