(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-navigation');

  const syncHeader = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && navigation) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navigation.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('nav-open', !expanded);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    });
  }

  const revealTargets = document.querySelectorAll(
    '.feature-card, .workflow-section, .cta-section, .status-section, .docs-index-card'
  );

  if (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    'IntersectionObserver' in window
  ) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  const statusRoot = document.querySelector('[data-service-status]');
  if (!statusRoot) {
    return;
  }

  const statusCard = statusRoot.querySelector('[data-status-card]');
  const statusText = statusRoot.querySelector('[data-status-text]');
  const statusDetail = statusRoot.querySelector('[data-status-detail]');
  const statusUpdated = statusRoot.querySelector('[data-status-updated]');
  const statusSummary = document.querySelector('[data-status-summary]');
  const cacheKey = 'juneover24-public-service-status-v1';
  const endpoint = 'https://status.beautify.mp.juneover24.cn/index.json';
  const refreshInterval = 120000;
  const staleLimit = 86400000;
  let lastAttemptAt = 0;
  let statusRequestInFlight = false;

  const statusMap = {
    operational: ['operational', '小程序服务正常'],
    resolved: ['operational', '小程序服务已恢复'],
    completed: ['operational', '维护已完成'],
    degraded: ['degraded', '小程序服务性能下降'],
    degraded_performance: ['degraded', '小程序服务性能下降'],
    partial_outage: ['degraded', '小程序服务部分异常'],
    monitoring: ['degraded', '小程序服务观察中'],
    identified: ['degraded', '问题已定位'],
    maintenance: ['maintenance', '小程序服务维护中'],
    under_maintenance: ['maintenance', '小程序服务维护中'],
    scheduled: ['maintenance', '已安排服务维护'],
    in_progress: ['maintenance', '服务维护进行中'],
    downtime: ['outage', '小程序服务故障'],
    major_outage: ['outage', '小程序服务严重故障'],
    investigating: ['outage', '小程序服务排查中'],
  };

  const formatTime = (value) => {
    if (!value) {
      return '更新时间未知';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '更新时间未知';
    }
    const parts = new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date).reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
    return `更新于 ${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
  };

  const renderStatus = (status, stale = false) => {
    const mappedState = Object.prototype.hasOwnProperty.call(statusMap, status.status)
      ? statusMap[status.status]
      : null;
    const state = mappedState || ['unknown', '状态暂不可用'];
    const className = stale && mappedState ? 'is-stale' : `is-${state[0]}`;
    statusCard.className = `status-card ${className}`;
    statusText.textContent = state[1];
    statusDetail.textContent = stale && mappedState
      ? '正在显示上次成功获取的状态'
      : mappedState
        ? '数据来自公开状态 API'
        : '公开状态 API 返回了暂未识别的状态';
    statusUpdated.textContent = formatTime(status.updatedAt);
    if (statusSummary) {
      statusSummary.textContent = stale && mappedState ? `${state[1]}（非实时）` : state[1];
    }
  };

  const readCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      const cacheAge = cached && typeof cached.fetchedAt === 'number'
        ? Date.now() - cached.fetchedAt
        : Number.NaN;
      if (
        cached && typeof cached.status === 'string' &&
        Number.isFinite(cached.fetchedAt) &&
        cacheAge >= 0 && cacheAge <= staleLimit
      ) {
        return cached;
      }
    } catch (_) {
      return null;
    }
    return null;
  };

  const saveCache = (status) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(status));
    } catch (_) {
      // 状态缓存仅用于显示降级，不影响正常读取。
    }
  };

  const renderUnknown = () => {
    statusCard.className = 'status-card is-unknown';
    statusText.textContent = '状态暂不可用';
    statusDetail.textContent = '公开状态 API 暂时无法读取';
    statusUpdated.textContent = '请稍后重试';
    if (statusSummary) {
      statusSummary.textContent = '状态暂不可用';
    }
  };

  const loadStatus = async () => {
    if (statusRequestInFlight || Date.now() - lastAttemptAt < refreshInterval) {
      return;
    }
    lastAttemptAt = Date.now();
    statusRequestInFlight = true;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    let timeout = 0;

    try {
      const request = fetch(endpoint, {
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'default',
        signal: controller ? controller.signal : undefined,
        headers: { Accept: 'application/json' },
      });
      const timeoutRequest = new Promise((_, reject) => {
        timeout = window.setTimeout(() => {
          if (controller) {
            controller.abort();
          }
          reject(new Error('status request timeout'));
        }, 8000);
      });
      const response = await Promise.race([request, timeoutRequest]);
      if (!response.ok) {
        throw new Error(`status response ${response.status}`);
      }
      const payload = await response.json();
      const services = Array.isArray(payload.included) ? payload.included : [];
      const miniapp = services.find((item) => (
        item && item.type === 'status_page_resource' && item.id === 'miniapp-service'
      ));
      const attributes = miniapp && miniapp.attributes;
      const rawStatus = attributes && attributes.status;
      if (typeof rawStatus !== 'string' || rawStatus.length === 0) {
        throw new Error('miniapp-service is missing');
      }
      const normalized = {
        status: rawStatus.toLowerCase(),
        updatedAt: attributes.updated_at || (
          payload.data && payload.data.attributes ? payload.data.attributes.updated_at : ''
        ),
        fetchedAt: Date.now(),
      };
      saveCache(normalized);
      renderStatus(normalized);
    } catch (_) {
      const cached = readCache();
      if (cached) {
        renderStatus(cached, true);
      } else {
        renderUnknown();
      }
    } finally {
      window.clearTimeout(timeout);
      statusRequestInFlight = false;
    }
  };

  const cached = readCache();
  if (cached) {
    renderStatus(cached, true);
  }
  loadStatus();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      loadStatus();
    }
  });
})();
