/**
 * 浏览器检测工具
 * 检查当前浏览器是否为Chrome，如果不是则显示全屏提示
 */

(function() {
  // 在DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为Chrome浏览器
    if (!isChromeBrowser()) {
      showChromeRecommendation();
    }
  });

  /**
   * 检测当前浏览器是否为Chrome
   * @returns {boolean} 是否为Chrome浏览器
   */
  function isChromeBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    // 检测Chrome浏览器，排除Edge等基于Chromium的浏览器
    return /chrome/.test(userAgent) && !/edg|edge|opr|opera/.test(userAgent);
  }

  /**
   * 获取当前设备类型
   * @returns {string} 设备类型：'windows', 'mac', 'android', 'ios', 或 'unknown'
   */
  function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/android/.test(userAgent)) {
      return 'android';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/win/.test(userAgent)) {
      return 'windows';
    } else if (/mac/.test(userAgent)) {
      return 'mac';
    } else {
      return 'unknown';
    }
  }

  /**
   * 根据设备类型获取Chrome下载链接
   * @returns {Object} 包含下载链接和文本的对象
   */
  function getChromeDownloadInfo() {
    const deviceType = getDeviceType();
    
    switch (deviceType) {
      case 'windows':
        return {
          url: 'https://www.google.cn/chrome/',
          text: 'Windows版Chrome'
        };
      case 'mac':
        return {
          url: 'https://www.google.cn/chrome/',
          text: 'Mac版Chrome'
        };
      case 'android':
        return {
          url: 'https://play.google.com/store/apps/details?id=com.android.chrome',
          text: 'Android版Chrome'
        };
      case 'ios':
        return {
          url: 'https://apps.apple.com/cn/app/google-chrome/id535886823',
          text: 'iOS版Chrome'
        };
      default:
        return {
          url: 'https://www.google.cn/chrome/',
          text: 'Chrome浏览器'
        };
    }
  }

  /**
   * 显示Chrome推荐提示
   */
  function showChromeRecommendation() {
    const downloadInfo = getChromeDownloadInfo();
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'chrome-recommendation-overlay';
    
    // 创建提示框
    const modal = document.createElement('div');
    modal.className = 'chrome-recommendation-modal';
    
    // 添加内容
    modal.innerHTML = `
      <div class="chrome-recommendation-content">
        <div class="chrome-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
            <circle cx="50" cy="50" r="45" fill="#4285F4" />
            <circle cx="50" cy="50" r="18" fill="white" />
            <circle cx="50" cy="50" r="13" fill="#4285F4" />
            <path d="M50,32 L82,32 L68,55 L50,55 Z" fill="#EA4335" />
            <path d="M50,32 L18,32 L32,55 L50,55 Z" fill="#FBBC05" />
            <path d="M32,55 L18,78 L50,78 L68,55 Z" fill="#34A853" />
          </svg>
        </div>
        <h2>为了获得最佳使用体验</h2>
        <p>建议您使用 Google Chrome 浏览器访问本站</p>
        <a href="${downloadInfo.url}" class="download-button" target="_blank">
          <span class="download-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </span>
          下载${downloadInfo.text}
        </a>
        <button class="continue-button">继续访问</button>
      </div>
    `;
    
    // 添加到页面
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
      .chrome-recommendation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .chrome-recommendation-modal {
        background-color: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(30px);
        opacity: 0;
        transition: transform 0.6s ease, opacity 0.6s ease;
      }
      
      .chrome-recommendation-content {
        text-align: center;
      }
      
      .chrome-logo {
        margin: 0 auto 20px;
        width: 80px;
        height: 80px;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
      
      .chrome-recommendation-content h2 {
        color: #333;
        font-size: 24px;
        margin-bottom: 15px;
      }
      
      .chrome-recommendation-content p {
        color: #666;
        font-size: 16px;
        margin-bottom: 25px;
      }
      
      .download-button {
        display: inline-block;
        background-color: #4285F4;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        text-decoration: none;
        font-weight: bold;
        margin-bottom: 15px;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }
      
      .download-button:hover {
        background-color: #3367D6;
        transform: translateY(-2px);
      }
      
      .download-icon {
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
      }
      
      .continue-button {
        background: none;
        border: 2px solid #ccc;
        color: #666;
        padding: 10px 20px;
        border-radius: 30px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      .continue-button:hover {
        border-color: #999;
        color: #333;
      }
      
      /* 动画类 */
      .show-overlay {
        opacity: 1;
      }
      
      .show-modal {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    
    document.head.appendChild(style);
    
    // 添加动画效果
    setTimeout(() => {
      overlay.classList.add('show-overlay');
    }, 100);
    
    setTimeout(() => {
      modal.classList.add('show-modal');
    }, 300);
    
    // 添加继续访问按钮事件
    const continueButton = modal.querySelector('.continue-button');
    continueButton.addEventListener('click', function() {
      // 淡出动画
      modal.style.transform = 'translateY(30px)';
      modal.style.opacity = '0';
      
      setTimeout(() => {
        overlay.style.opacity = '0';
        
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 500);
      }, 300);
    });
  }
})();