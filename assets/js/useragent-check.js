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
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)'; // 深色半透明背景
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column'; // 允许内容垂直排列
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.textAlign = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.fontSize = '20px'; // 稍大字体
        overlay.style.padding = '30px';
        overlay.style.boxSizing = 'border-box';
        overlay.style.opacity = '0'; // 初始透明
        overlay.style.transition = 'opacity 0.5s ease-in-out'; // 淡入动画

        // 添加一个提示图标 (可选, 使用简单的文本符号)
        const icon = document.createElement('div');
        icon.innerText = '⚠️'; // 警告图标
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '20px';

        const message = document.createElement('p');
        message.innerHTML = '抱歉，当前页面不支持在微信或QQ内部直接打开。<br><br>请点击右上角的 <strong>“…”</strong> 或 <strong>“更多”</strong> 按钮，<br>然后选择 <strong>“在浏览器中打开”</strong> 以获得最佳体验。';
        message.style.margin = '0';
        message.style.lineHeight = '1.6'; // 增加行高

        overlay.appendChild(icon);
        overlay.appendChild(message);
        document.body.appendChild(overlay);

        // 触发淡入效果
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50); // 短暂延迟以确保CSS过渡生效
    }
})();
  