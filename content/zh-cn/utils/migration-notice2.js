/**
 * 功能迁移提示工具
 * 提示用户功能已迁移至小程序“JuneOver24 Service”
 */

(function () {
  // 在DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', function () {
    checkMigrationStatus();
  });

  /**
   * 检查并显示迁移提示
   */
  function checkMigrationStatus() {
    // 设定截止日期：2025年12月10日
    const DEADLINE_DATE = new Date('2025-12-24T00:00:00');
    const currentDate = new Date();

    // 判断是否已过期
    const isExpired = currentDate >= DEADLINE_DATE;

    showMigrationNotice(isExpired, DEADLINE_DATE);
  }

  /**
   * 显示迁移通知
   * @param {boolean} isExpired 是否已过期
   * @param {Date} deadlineDate 截止日期
   */
  function showMigrationNotice(isExpired, deadlineDate) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'migration-notice-overlay';

    // 创建提示框
    const modal = document.createElement('div');
    modal.className = 'migration-notice-modal';

    // 格式化日期显示
    const dateStr = `${deadlineDate.getFullYear()}年${deadlineDate.getMonth() + 1}月${deadlineDate.getDate()}日`;

    // 构建内容
    let contentHtml = `
      <div class="migration-notice-content">
        <div class="notice-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <h2>功能迁移通知</h2>
        <p class="main-message">该功能已经迁移至小程序<br><strong>“JuneOver24 Service”</strong></p>
        <p class="sub-message">请微信搜索或者在公众号按照教程使用！</p>
    `;

    if (isExpired) {
      // 过期强制提示
      contentHtml += `
        <div class="warning-box expired">
          <p>服务已于 ${dateStr} 停止网页版支持</p>
          <p>请前往小程序继续使用</p>
        </div>
        <!-- 无关闭/继续按钮，强制停留 -->
      `;
    } else {
      // 未过期提示
      contentHtml += `
        <div class="warning-box active">
          <p><strong>到期提示：</strong>本网页版将于 <strong>${dateStr}</strong> 停止服务。</p>
        </div>
        <button class="continue-button">我已知晓，继续访问</button>
      `;
    }

    contentHtml += `</div>`;
    modal.innerHTML = contentHtml;

    // 添加到页面
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 添加CSS样式
    addMigrationStyles();

    // 添加动画效果
    requestAnimationFrame(() => {
      overlay.classList.add('show-overlay');
      setTimeout(() => {
        modal.classList.add('show-modal');
      }, 100);
    });

    // 如果未过期，绑定继续按钮事件
    if (!isExpired) {
      const continueButton = modal.querySelector('.continue-button');
      if (continueButton) {
        continueButton.addEventListener('click', function () {
          closeModal(overlay, modal);
        });
      }
    }
  }

  /**
   * 关闭模态框
   */
  function closeModal(overlay, modal) {
    modal.style.transform = 'translateY(30px)';
    modal.style.opacity = '0';

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      }, 500);
    }, 300);
  }

  /**
   * 添加CSS样式
   */
  function addMigrationStyles() {
    const styleId = 'migration-notice-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .migration-notice-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9); /* 加深背景，强调强制性 */
        z-index: 10000; /* 确保在最上层 */
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.5s ease;
        backdrop-filter: blur(5px); /* 添加背景模糊 */
      }
      
      .migration-notice-modal {
        background-color: white;
        border-radius: 16px;
        padding: 40px 30px;
        max-width: 450px;
        width: 85%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: translateY(30px);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
        text-align: center;
      }
      
      .notice-icon {
        margin-bottom: 20px;
        color: #4285F4;
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-10px);}
        60% {transform: translateY(-5px);}
      }
      
      .migration-notice-content h2 {
        color: #333;
        font-size: 24px;
        margin: 0 0 15px;
        font-weight: 700;
      }
      
      .main-message {
        color: #444;
        font-size: 18px;
        margin-bottom: 10px;
        line-height: 1.5;
      }
      
      .main-message strong {
        color: #4285F4;
        font-size: 20px;
      }
      
      .sub-message {
        color: #666;
        font-size: 15px;
        margin-bottom: 25px;
      }
      
      .warning-box {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 25px;
        font-size: 14px;
        color: #555;
      }
      
      .warning-box.expired {
        background-color: #fff5f5;
        border-color: #ffc9c9;
        color: #fa5252;
        font-weight: bold;
      }

      .warning-box.active {
        background-color: #fff9db;
        border-color: #ffec99;
        color: #e67700;
      }
      
      .continue-button {
        background-color: #4285F4;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 30px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(66, 133, 244, 0.2);
      }
      
      .continue-button:hover {
        background-color: #3367D6;
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(66, 133, 244, 0.3);
      }
      
      .continue-button:active {
        transform: translateY(0);
      }
      
      /* 动画状态类 */
      .show-overlay {
        opacity: 1;
      }
      
      .show-modal {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    document.head.appendChild(style);
  }
})();
