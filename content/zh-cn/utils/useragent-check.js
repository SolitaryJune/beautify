(function () {
    const ua = navigator.userAgent.toLowerCase();
    const isWeChat = ua.includes('micromessenger');
    const isQQ = ua.includes('qq/') || ua.includes('qqbrowser');
  
    if (isWeChat || isQQ) {
      // 引入 SweetAlert2 弹窗库
      if (typeof Swal === "undefined") {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        document.head.appendChild(script);
  
        script.onload = function () {
          // 弹窗显示
          Swal.fire({
            title: '提示',
            text: '当前页面不支持在 QQ 或 微信中打开\n请点击右上角 “…” 选择 “在浏览器中打开”',
            icon: 'warning',
            confirmButtonText: '确定',
            background: '#f8d7da',
            color: '#721c24',
            confirmButtonColor: '#3085d6',
            position: 'center'
          });
        };
      }
    }
  })();
  