(function () {
    const ua = navigator.userAgent.toLowerCase();
    const isWeChat = ua.includes('micromessenger');
    const isQQ = ua.includes('qq/') || ua.includes('qqbrowser');
  
    if (isWeChat || isQQ) {
            // 创建并显示全屏覆盖提示
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // 深色半透明背景
      overlay.style.color = 'white';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.textAlign = 'center';
      overlay.style.zIndex = '9999';
      overlay.style.fontSize = '18px';
      overlay.style.padding = '20px';
      overlay.style.boxSizing = 'border-box';

      const message = document.createElement('p');
      message.innerText = '当前页面不支持在 QQ 或 微信中打开\n请点击右上角 “…” 选择 “在浏览器中打开”';
      message.style.margin = '0';

      overlay.appendChild(message);
      document.body.appendChild(overlay);
    }
  })();
  