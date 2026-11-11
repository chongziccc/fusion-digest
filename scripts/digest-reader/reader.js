/* Offline reader: data is embedded in HTML, no fetch or server. */
(() => {
  const data = JSON.parse(document.getElementById('reader-data').textContent);
  const app = document.getElementById('app');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage = {get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  
  // Theme management
  const updateThemeBtn = t => {
    const btn = document.getElementById('theme');
    if (btn) btn.innerHTML = t === 'dark' ? '☀️ 浅色' : '🌙 深色';
  };
  const initialTheme = storage.get('digest-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = initialTheme;
  updateThemeBtn(initialTheme);
  
  const themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      storage.set('digest-theme', next);
      updateThemeBtn(next);
    };
  }

  // Cloud sync status button in masthead
  const mast = document.querySelector('.mast');
  if (mast && !document.getElementById('cloud-sync-btn')) {
    const syncBtn = document.createElement('button');
    syncBtn.id = 'cloud-sync-btn';
    const isOnline = window.location.protocol.startsWith('http');
    syncBtn.className = 'btn-cloud-sync' + (isOnline ? '' : ' is-offline');
    syncBtn.innerHTML = isOnline ? '☁️ 云端同步' : '⚡ 离线副本';
    syncBtn.title = isOnline ? '已连接云端实时同步，点击刷新' : '当前为本地离线副本，点击尝试连接云端';
    syncBtn.onclick = () => {
      if (isOnline) {
        syncBtn.innerHTML = '🔄 刷新中...';
        window.location.reload();
      } else {
        syncBtn.innerHTML = '🔄 连接云端...';
        window.location.href = 'https://chongziccc.github.io/fusion-digest/research/daily-digest/index.html';
      }
    };
    if (themeBtn) themeBtn.before(syncBtn);
    else mast.append(syncBtn);
  }
  const homeHref = data.home || (data.kind === 'index' ? 'index.html' : '../index.html');
  const basePath = homeHref === 'index.html' ? '' : homeHref.replace('index.html', '');
  const currentPath = (window.location.pathname || '').toLowerCase();
  const isIndexPage = data.kind === 'index' || currentPath.endsWith('index.html') || currentPath.endsWith('/daily-digest/') || (!data.kind && !data.date);

  // Authoritative Tracked Submission Calendar Deadlines (UTC epoch timestamps)
  const VENUE_DEADLINES = [
    {
      id: 'cvpr2027-abstract',
      name: 'CVPR 2027 (Abstract)',
      matchNames: ['cvpr 2027 (abstract)', 'cvpr 2027 摘要', 'cvpr 2027 abstract'],
      shortLabel: 'CVPR 2027 摘要',
      deadlineUtcMs: Date.UTC(2026, 10, 11, 11, 59, 59), // 2026-11-10 23:59:59 AoE = 2026-11-11 11:59:59 UTC = 2026-11-11 19:59:59 Beijing
      bjStr: '2026-11-11 19:59:59'
    },
    {
      id: 'cvpr2027-paper',
      name: 'CVPR 2027 (Full Paper)',
      matchNames: ['cvpr 2027 (full paper)', 'cvpr 2027 全文', 'cvpr 2027 full paper'],
      shortLabel: 'CVPR 2027 全文',
      deadlineUtcMs: Date.UTC(2026, 10, 17, 11, 59, 59), // 2026-11-16 23:59:59 AoE = 2026-11-17 19:59:59 Beijing
      bjStr: '2026-11-17 19:59:59'
    },
    {
      id: 'cvpr2027-supp',
      name: 'CVPR 2027 (Supplementary)',
      matchNames: ['cvpr 2027 (supplementary)', 'cvpr 2027 补充材料', 'cvpr 2027 supplementary'],
      shortLabel: 'CVPR 2027 附录',
      deadlineUtcMs: Date.UTC(2026, 10, 24, 11, 59, 59), // 2026-11-23 23:59:59 AoE = 2026-11-24 19:59:59 Beijing
      bjStr: '2026-11-24 19:59:59'
    },
    {
      id: 'icme2027',
      name: 'ICME 2027',
      matchNames: ['icme 2027', 'icme'],
      shortLabel: 'ICME 2027',
      deadlineUtcMs: Date.UTC(2026, 11, 16, 11, 59, 59), // 2026-12-15 23:59:59 AoE = 2026-12-16 19:59:59 Beijing
      bjStr: '2026-12-16 19:59:59'
    },
    {
      id: 'infofusion-si',
      name: 'Information Fusion',
      matchNames: ['information fusion', 'infofusion'],
      shortLabel: 'InfoFusion 特刊',
      deadlineUtcMs: Date.UTC(2026, 11, 31, 23, 59, 59), // 2026-12-31 23:59:59 UTC = 2027-01-01 07:59:59 Beijing
      bjStr: '2027-01-01 07:59:59'
    },
    {
      id: 'ijcai2027-abstract',
      name: 'IJCAI 2027 (Abstract)',
      matchNames: ['ijcai 2027 (abstract)', 'ijcai 2027 摘要'],
      shortLabel: 'IJCAI 2027 摘要',
      deadlineUtcMs: Date.UTC(2027, 0, 15, 11, 59, 59), // 2027-01-14 23:59:59 AoE = 2027-01-15 19:59:59 Beijing
      bjStr: '2027-01-15 19:59:59'
    },
    {
      id: 'ijcai2027-paper',
      name: 'IJCAI 2027 (Full Paper)',
      matchNames: ['ijcai 2027 (full paper)', 'ijcai 2027 全文'],
      shortLabel: 'IJCAI 2027 全文',
      deadlineUtcMs: Date.UTC(2027, 0, 22, 11, 59, 59), // 2027-01-21 23:59:59 AoE = 2027-01-22 19:59:59 Beijing
      bjStr: '2027-01-22 19:59:59'
    },
    {
      id: 'icip2027',
      name: 'ICIP 2027',
      matchNames: ['icip 2027', 'icip'],
      shortLabel: 'ICIP 2027',
      deadlineUtcMs: Date.UTC(2027, 0, 28, 23, 59, 59), // 2027-01-28 23:59:59 UTC = 2027-01-29 07:59:59 Beijing
      bjStr: '2027-01-29 07:59:59'
    },
    {
      id: 'iccv2027-abstract',
      name: 'ICCV 2027 (Abstract)',
      matchNames: ['iccv 2027 (abstract)', 'iccv 2027 摘要'],
      shortLabel: 'ICCV 2027 摘要',
      deadlineUtcMs: Date.UTC(2027, 2, 4, 11, 59, 59), // 2027-03-03 23:59:59 AoE = 2027-03-04 19:59:59 Beijing
      bjStr: '2027-03-04 19:59:59'
    },
    {
      id: 'iccv2027-paper',
      name: 'ICCV 2027 (Full Paper)',
      matchNames: ['iccv 2027 (full paper)', 'iccv 2027 全文'],
      shortLabel: 'ICCV 2027 全文',
      deadlineUtcMs: Date.UTC(2027, 2, 11, 11, 59, 59), // 2027-03-10 23:59:59 AoE = 2027-03-11 19:59:59 Beijing
      bjStr: '2027-03-11 19:59:59'
    },
    {
      id: 'tip-si',
      name: 'IEEE Transactions on Image Processing (TIP)',
      matchNames: ['ieee transactions on image processing', 'tip', 'transactions on image processing'],
      shortLabel: 'IEEE TIP 特刊',
      deadlineUtcMs: Date.UTC(2027, 2, 15, 23, 59, 59), // 2027-03-15 23:59:59 UTC = 2027-03-16 07:59:59 Beijing
      bjStr: '2027-03-16 07:59:59'
    },
    {
      id: 'acmmm2027-abstract',
      name: 'ACM MM 2027 (Abstract)',
      matchNames: ['acm mm 2027 (abstract)', 'acm mm 2027 摘要', 'acm mm abstract'],
      shortLabel: 'ACM MM 摘要',
      deadlineUtcMs: Date.UTC(2027, 3, 6, 11, 59, 59), // 2027-04-05 23:59:59 AoE = 2027-04-06 19:59:59 Beijing
      bjStr: '2027-04-06 19:59:59'
    },
    {
      id: 'acmmm2027-paper',
      name: 'ACM MM 2027 (Full Paper)',
      matchNames: ['acm mm 2027 (full paper)', 'acm mm 2027 全文', 'acm mm full paper'],
      shortLabel: 'ACM MM 全文',
      deadlineUtcMs: Date.UTC(2027, 3, 13, 11, 59, 59), // 2027-04-12 23:59:59 AoE = 2027-04-13 19:59:59 Beijing
      bjStr: '2027-04-13 19:59:59'
    }
  ];

  function formatBeijingTime(date) {
    const d = new Date(date.getTime() + 8 * 3600000);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }

  function getCountdownInfo(deadlineUtcMs) {
    const now = Date.now();
    const diffMs = deadlineUtcMs - now;
    if (diffMs <= 0) {
      return {
        status: 'expired',
        isExpired: true,
        countdownHtml: '<span class="badge-expired">已截止</span>',
        badgeHtml: '<span class="badge-expired">【已截止】</span>',
        shortStr: '已截止',
        heroColor: '#94a3b8'
      };
    }

    const totalHours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);

    if (diffMs < 24 * 3600 * 1000) {
      const timeStr = `${totalHours}h ${mins}m`;
      return {
        status: 'tonight',
        isExpired: false,
        countdownHtml: `<span class="badge-urgent badge-pulsing" title="截稿进入最后倒计时">🚨 剩 ${timeStr} (今晚)</span>`,
        badgeHtml: `<span class="badge-urgent badge-pulsing">🚨 【今晚截稿】</span>`,
        shortStr: `今晚 19:59 (剩 ${timeStr})`,
        heroColor: '#ef4444'
      };
    }

    const days = (diffMs / (24 * 3600 * 1000)).toFixed(1);
    const roundedDays = Math.round(diffMs / (24 * 3600 * 1000));

    if (diffMs < 14 * 24 * 3600 * 1000) {
      return {
        status: 'sprint',
        isExpired: false,
        countdownHtml: `<span class="badge-urgent" title="冲刺期">⚡ 剩 ${days} 天</span>`,
        badgeHtml: `<span class="badge-urgent">⚡ 【紧急冲刺】</span>`,
        shortStr: `仅剩 ${days} 天`,
        heroColor: '#f59e0b'
      };
    } else if (diffMs < 60 * 24 * 3600 * 1000) {
      return {
        status: 'near',
        isExpired: false,
        countdownHtml: `<span class="badge-countdown">📅 剩 ${roundedDays} 天</span>`,
        badgeHtml: `<span class="badge-warning">⚡ 【近期关注】</span>`,
        shortStr: `剩 ${roundedDays} 天`,
        heroColor: '#2dd4bf'
      };
    } else {
      return {
        status: 'plan',
        isExpired: false,
        countdownHtml: `<span class="badge-countdown">🌱 剩 ${roundedDays} 天</span>`,
        badgeHtml: `<span class="badge-info">📅 【规划远期】</span>`,
        shortStr: `剩 ${roundedDays} 天`,
        heroColor: '#a78bfa'
      };
    }
  }

  if (mast) {
    // Subpage back button
    if (!isIndexPage && !document.getElementById('mast-back')) {
      const backBtn = document.createElement('button');
      backBtn.id = 'mast-back';
      backBtn.className = 'btn-mast-back';
      backBtn.setAttribute('aria-label', '返回');
      backBtn.innerHTML = '‹ 返回';
      backBtn.onclick = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = basePath + 'index.html';
        }
      };
      mast.prepend(backBtn);
    }

    const brandLink = mast.querySelector('a');
    if (brandLink) {
      brandLink.className = 'mast-brand';
      brandLink.innerHTML = `<span class="mast-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg></span><span class="mast-title">融合研究 <span>/ 每日阅读</span></span>`;
    }
    if (!mast.querySelector('.mast-nav')) {
      const nav = document.createElement('nav');
      nav.className = 'mast-nav';
      nav.innerHTML = `
        <a href="${basePath}index.html" class="nav-item">🏠 首页</a>
        <a href="${basePath}submission_calendar_180d.html" class="nav-item">📅 投稿日历</a>
        <a href="${basePath}research_threads.html" class="nav-item">🧭 研究脉络</a>
        <a href="${basePath}idea_log.html" class="nav-item">💡 Idea 台账</a>
        <a href="${basePath}tool_watch.html" class="nav-item">🛠️ 工具雷达</a>
      `;
      if (themeBtn) themeBtn.before(nav);
      else mast.append(nav);
    }

    // Wide mode toggle (only relevant on desktop)
    const isWideDefault = /submission_calendar|venue_tiers|idea_log|read_log/i.test(data.source || data.title || '') ||
                          storage.get('digest-wide-mode') === 'true';
    if (isWideDefault && window.innerWidth > 768) {
      document.body.classList.add('wide-mode');
    }

    if (!document.getElementById('wide-toggle')) {
      const wideBtn = document.createElement('button');
      wideBtn.id = 'wide-toggle';
      wideBtn.className = 'btn-mast-toggle';
      wideBtn.setAttribute('aria-label', '切换宽屏模式');
      const updateWideBtn = () => {
        const isWide = document.body.classList.contains('wide-mode');
        wideBtn.innerHTML = isWide ? '⛶ 收起宽屏' : '⛶ 展开宽屏';
      };
      updateWideBtn();
      wideBtn.onclick = () => {
        document.body.classList.toggle('wide-mode');
        const isWide = document.body.classList.contains('wide-mode');
        storage.set('digest-wide-mode', isWide ? 'true' : 'false');
        updateWideBtn();
      };
      if (themeBtn) themeBtn.before(wideBtn);
      else mast.append(wideBtn);
    }
  }

  // Inject Dedicated Mobile Bottom Navigation Dock
  if (!document.getElementById('mobile-bottom-bar')) {
    const isHome = isIndexPage;
    const isDigest = !isHome && (currentPath.includes('digest.html') || currentPath.includes('/papers/'));
    const isCalendar = currentPath.includes('submission_calendar');
    const isIdea = currentPath.includes('idea_log') || currentPath.includes('research_threads');
    const isTool = currentPath.includes('tool_watch') || currentPath.includes('venue_tiers');

    const bottomNav = document.createElement('nav');
    bottomNav.id = 'mobile-bottom-bar';
    bottomNav.className = 'mobile-bottom-bar';
    bottomNav.setAttribute('aria-label', '移动端底栏导航');

    const latestDigestTarget = (data.entries && data.entries.length > 0 && data.entries[0].href)
      ? data.entries[0].href
      : '2026-11-11/digest.html';

    bottomNav.innerHTML = `
      <a href="${basePath}index.html" class="bottom-tab ${isHome ? 'is-active' : ''}">
        <span class="tab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </span>
        <span class="tab-label">首页</span>
      </a>
      <a href="${basePath}${latestDigestTarget}" class="bottom-tab ${isDigest ? 'is-active' : ''}">
        <span class="tab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </span>
        <span class="tab-label">今日精读</span>
      </a>
      <a href="${basePath}submission_calendar_180d.html" class="bottom-tab ${isCalendar ? 'is-active' : ''}">
        <span class="tab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </span>
        <span class="tab-label">投稿日历</span>
      </a>
      <a href="${basePath}idea_log.html" class="bottom-tab ${isIdea ? 'is-active' : ''}">
        <span class="tab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
        </span>
        <span class="tab-label">跨界假设</span>
      </a>
      <a href="${basePath}tool_watch.html" class="bottom-tab ${isTool ? 'is-active' : ''}">
        <span class="tab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </span>
        <span class="tab-label">工具雷达</span>
      </a>
    `;

    // Stop propagation so taps on dock never pass through to underlying links or tables
    bottomNav.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    bottomNav.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
    bottomNav.addEventListener('click', (e) => e.stopPropagation());

    bottomNav.querySelectorAll('.bottom-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(10);
      });
    });

    document.body.appendChild(bottomNav);
  }

  // Reading progress bar
  let bar = document.getElementById('reading-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);
  }
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });

  // Controlled mouse wheel damping (fixes aggressive kinetic jump on emulator & PC mouse)
  (() => {
    let currentY = window.scrollY;
    let targetY = currentY;
    let isAnimating = false;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const stepAnimation = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY = clamp(targetY, 0, maxScroll);
      currentY += (targetY - currentY) * 0.35;

      if (Math.abs(targetY - currentY) < 1) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isAnimating = false;
        return;
      }

      window.scrollTo(0, currentY);
      requestAnimationFrame(stepAnimation);
    };

    window.addEventListener('scroll', () => {
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = currentY;
      }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (e.defaultPrevented) return;

      // Check if mouse is over an inner scroll container (like table-scroll or katex)
      let el = e.target;
      let innerContainer = null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const canScrollY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
        const canScrollX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth;
        if (canScrollY || canScrollX) {
          innerContainer = el;
          break;
        }
        el = el.parentElement;
      }

      if (innerContainer) {
        if (innerContainer.classList.contains('table-scroll') || innerContainer.classList.contains('katex-display')) {
          e.preventDefault();
          const delta = (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
          innerContainer.scrollLeft += Math.sign(delta) * 50;
          return;
        }
        return;
      }

      // Intercept wheel to cancel runaway jump on PC & Android emulator
      e.preventDefault();

      let rawDelta = e.deltaY || 0;
      if (e.deltaMode === 1) rawDelta *= 24; // lines to px
      else if (e.deltaMode === 2) rawDelta *= window.innerHeight; // pages to px

      if (rawDelta === 0) return;

      // Normalized gentle step: clamp single wheel step to at most 50px
      const step = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta) * 0.42, 50);
      targetY += step;

      // Restrain maximum forward lead to 50% of viewport height
      const maxLead = window.innerHeight * 0.5;
      if (targetY > currentY + maxLead) targetY = currentY + maxLead;
      if (targetY < currentY - maxLead) targetY = currentY - maxLead;

      if (!isAnimating) {
        isAnimating = true;
        currentY = window.scrollY;
        requestAnimationFrame(stepAnimation);
      }
    }, { passive: false });
  })();

  // Floating Back to Top Button
  (() => {
    let topBtn = document.getElementById('back-to-top-fab');
    if (!topBtn) {
      topBtn = document.createElement('button');
      topBtn.id = 'back-to-top-fab';
      topBtn.className = 'btn-back-to-top';
      topBtn.setAttribute('aria-label', '返回顶部');
      topBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
      
      const doScrollTop = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (window.scrollY > 0) window.scrollTo(0, 0);
        }, 320);
      };

      topBtn.addEventListener('click', doScrollTop);
      topBtn.addEventListener('touchend', doScrollTop);
      document.body.appendChild(topBtn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        topBtn.classList.add('is-visible');
      } else {
        topBtn.classList.remove('is-visible');
      }
    }, { passive: true });
  })();

  // Touch Swipe / Fling Momentum Limiter (Prevents single flick from rocketing past whole page)
  (() => {
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;
    let isTouching = false;
    let flingId = null;

    window.addEventListener('touchstart', (e) => {
      isTouching = true;
      if (flingId) {
        cancelAnimationFrame(flingId);
        flingId = null;
      }
      if (e.touches.length === 1) {
        lastY = e.touches[0].clientY;
        lastTime = performance.now();
        velocity = 0;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 8) {
          const dy = lastY - e.touches[0].clientY;
          velocity = dy / dt; // px/ms
          lastY = e.touches[0].clientY;
          lastTime = now;
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (!isTouching) return;
      isTouching = false;

      // Fast flick detected (velocity > 0.45 px/ms)
      if (Math.abs(velocity) > 0.45) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const maxTravel = Math.min(window.innerHeight * 0.45, 340);
        const travel = Math.sign(velocity) * Math.min(maxTravel, Math.abs(velocity) * 150);
        const startY = window.scrollY;
        const targetY = Math.max(0, Math.min(maxScroll, startY + travel));

        if (Math.abs(targetY - startY) > 5) {
          const startTime = performance.now();
          const duration = 260;
          const easeOut = t => 1 - Math.pow(1 - t, 3);

          const stepFling = (now) => {
            if (isTouching) return;
            const elapsed = now - startTime;
            if (elapsed < duration) {
              const p = easeOut(elapsed / duration);
              window.scrollTo(0, startY + (targetY - startY) * p);
              flingId = requestAnimationFrame(stepFling);
            } else {
              window.scrollTo(0, targetY);
              flingId = null;
            }
          };

          flingId = requestAnimationFrame(stepFling);
        }
      }
    }, { passive: true });
  })();

  const safeURL = value => {
    const url = String(value).replace(/[\u0000-\u0020\u007f]/g, '');
    if (/^(?:https?:|mailto:|file:)/i.test(url) || !/^[a-z][a-z\d+.-]*:/i.test(url)) return url;
    return '';
  };

  function renderMarkdown(source, target) {
    const math = [];
    // Protect math tokens before Markdown eats backslashes
    const prepared = source.replace(/```[\s\S]*?```|`[^`\n]+`|\$\$([\s\S]+?)\$\$|\$([^$\n]+)\$/g, (whole, display, inline) => {
      if (display === undefined && inline === undefined) return whole;
      const index = math.push({ tex: display ?? inline, display: display !== undefined }) - 1;
      return `DIGESTMATHTOKEN${index}END`;
    });
    const renderer = new marked.Renderer();
    renderer.html = token => esc(token.text);
    const template = document.createElement('template');
    template.innerHTML = marked.parse(prepared, { renderer, gfm: true });
    
    // Clean attributes
    template.content.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(a => { if (a.name.startsWith('on') || a.name === 'style') el.removeAttribute(a.name); });
      for (const attr of ['href', 'src']) if (el.hasAttribute(attr)) {
        let url = safeURL(el.getAttribute(attr));
        if (attr === 'href') url = url.replace(/\.md(?=($|#|\?))/, '.html');
        if (url) el.setAttribute(attr, url); else el.removeAttribute(attr);
      }
    });
    target.append(template.content);

    // Replace math tokens with KaTeX
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement.closest('pre,code')) return;
      if (!node.textContent.includes('DIGESTMATHTOKEN')) return;
      const frag = document.createDocumentFragment(); let at = 0;
      for (const match of node.textContent.matchAll(/DIGESTMATHTOKEN(\d+)END/g)) {
        frag.append(document.createTextNode(node.textContent.slice(at, match.index)));
        const m = math[Number(match[1])], span = document.createElement('span');
        if (m.display) span.className = 'math-display';
        try { span.innerHTML = katex.renderToString(m.tex, { displayMode: m.display, throwOnError: true, trust: false, strict: 'warn' }); }
        catch { span.className = 'math-error'; span.textContent = '公式待校验：' + m.tex; }
        frag.append(span); at = match.index + match[0].length;
      }
      frag.append(document.createTextNode(node.textContent.slice(at))); node.replaceWith(frag);
    });

    // Wrap tables in responsive scrollers and format columns smartly
    target.querySelectorAll('table').forEach(t => {
      const div = document.createElement('div');
      div.className = 'table-scroll';
      t.replaceWith(div);
      div.append(t);

      // Analyze header names
      const ths = Array.from(t.querySelectorAll('thead th'));
      const headerNames = ths.map(th => th.textContent.trim());

      let descCol = -1;
      let timeCols = [];
      let cfpCol = -1;

      headerNames.forEach((name, idx) => {
        if (/建议|理由|结论|用途|说明|增量|失效/.test(name)) {
          descCol = idx;
          if (ths[idx]) ths[idx].classList.add('col-desc');
        } else if (/截稿|时间|日期/.test(name) && !/打分/.test(name)) {
          timeCols.push(idx);
          if (ths[idx]) ths[idx].classList.add('col-time');
        } else if (/CFP|链接|URL/i.test(name)) {
          cfpCol = idx;
          if (ths[idx]) ths[idx].classList.add('col-cfp');
        }
      });

      // Format rows
      t.querySelectorAll('tbody tr').forEach(tr => {
        const cells = Array.from(tr.children);
        cells.forEach((td, idx) => {
          const text = td.textContent.trim();

          // Sticky first column (Venue name, Paper title, or Date)
          if (idx === 0) {
            td.classList.add('cell-sticky');
          }

          // Description column: wrap cleanly
          if (idx === descCol) {
            td.classList.add('cell-desc');
          }

          // CFP link column: turn into sleek compact action button
          if (idx === cfpCol || (td.querySelector('a') && /CFP/i.test(text))) {
            const link = td.querySelector('a');
            if (link) {
              link.className = 'btn-table-action btn-cfp';
              link.innerHTML = '<span>🔗</span> CFP 官网';
              link.target = '_blank';
              link.rel = 'noopener';
              td.classList.add('cell-nowrap');
            }
          }

          // Time columns: compact stacked formatting
          if (timeCols.includes(idx)) {
            const aoeMatch = text.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::\d{2})?\s+(AoE.*?)$/i);
            const bjMatch = text.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::\d{2})?(.*)$/);
            if (aoeMatch) {
              td.innerHTML = `<div class="time-main">${aoeMatch[1]} ${aoeMatch[2]}</div><div class="time-tz">${esc(aoeMatch[3])}</div>`;
              td.classList.add('cell-time', 'cell-nowrap');
            } else if (bjMatch && /\d{4}-\d{2}-\d{2}/.test(text) && text.length < 40) {
              const tzNote = bjMatch[3].trim() ? esc(bjMatch[3].trim()) : '北京时间 (Tdeadline)';
              td.innerHTML = `<div class="time-main time-bj">${bjMatch[1]} ${bjMatch[2]}</div><div class="time-tz">${tzNote}</div>`;
              td.classList.add('cell-time', 'cell-nowrap');
            }
          }

          // ArXiv ID / DOI in tables (e.g. read_log.html)
          if (/^arxiv:\d{4}\.\d{4,5}/i.test(text)) {
            const rawId = text.replace(/^arxiv:/i, '').trim();
            td.innerHTML = `<a class="badge-arxiv" href="https://arxiv.org/abs/${rawId}" target="_blank" rel="noopener">📄 ${esc(text)}</a>`;
            td.classList.add('cell-nowrap');
          }

          // Paper evaluation score (e.g. 10/12, 11/12)
          if (/^\d{1,2}\s*\/\s*12$/.test(text)) {
            td.innerHTML = `<span class="badge-score">⭐ ${esc(text)}</span>`;
            td.classList.add('cell-nowrap');
          }

          // Level alerts
          if (text.includes('【紧急】')) {
            td.innerHTML = td.innerHTML.replace(/【紧急】/g, '<span class="badge-urgent">🚨 【紧急】</span>');
            td.classList.add('cell-nowrap');
          } else if (text.includes('【近期】')) {
            td.innerHTML = td.innerHTML.replace(/【近期】/g, '<span class="badge-warning">⚡ 【近期】</span>');
            td.classList.add('cell-nowrap');
          } else if (text.includes('【规划】')) {
            td.innerHTML = td.innerHTML.replace(/【规划】/g, '<span class="badge-info">📅 【规划】</span>');
            td.classList.add('cell-nowrap');
          } else if (text.includes('【远期】')) {
            td.innerHTML = td.innerHTML.replace(/【远期】/g, '<span class="badge-muted">🌱 【远期】</span>');
            td.classList.add('cell-nowrap');
          } else if (text.includes('【持续开放】')) {
            td.innerHTML = td.innerHTML.replace(/【持续开放】/g, '<span class="badge-info">🔄 【持续开放】</span>');
            td.classList.add('cell-nowrap');
          }

          // CCF / Tier badges
          if (/^CCF-A$/i.test(text) || text === '**CCF-A**') {
            td.innerHTML = '<span class="badge-tier badge-tier-a">CCF-A</span>';
            td.classList.add('cell-nowrap');
          } else if (/^CCF-B$/i.test(text) || text === '**CCF-B**') {
            td.innerHTML = '<span class="badge-tier badge-tier-b">CCF-B</span>';
            td.classList.add('cell-nowrap');
          } else if (/^CCF-C$/i.test(text) || text === '**CCF-C**') {
            td.innerHTML = '<span class="badge-tier badge-tier-c">CCF-C</span>';
            td.classList.add('cell-nowrap');
          } else if (text.includes('1 区 TOP')) {
            td.innerHTML = `<span class="badge-tier badge-top-journal">${esc(text)}</span>`;
            td.classList.add('cell-nowrap');
          }

          // Countdown
          if (text.includes('剩余') && text.includes('天')) {
            td.innerHTML = `<span class="badge-countdown">${td.innerHTML}</span>`;
            td.classList.add('cell-nowrap');
          }

          // Idea ID badges
          if (/^IDEA-\d+$/i.test(text)) {
            td.innerHTML = `<span class="badge-idea-id">${esc(text)}</span>`;
            td.classList.add('cell-nowrap');
          }
          // Idea Proposed status
          if (text.toLowerCase() === 'proposed') {
            td.innerHTML = '<span class="badge-proposed">● proposed</span>';
            td.classList.add('cell-nowrap');
          }
          // Domain badges
          if (/力学|物理|材料|几何|相对论|流体/i.test(text) && text.length < 35 && !text.includes('。')) {
            td.innerHTML = `<span class="badge-domain">${esc(text)}</span>`;
            td.classList.add('cell-nowrap');
          }
        });
      });
    });

    // Image zoom dialogs
    target.querySelectorAll('img').forEach(img => img.onclick = () => {
      const d = document.createElement('dialog'), x = img.cloneNode();
      d.append(x); d.onclick = () => d.close(); d.addEventListener('close', () => d.remove());
      document.body.append(d); d.showModal();
    });

    // Beautify Paper Metadata Lists into structured cards
    target.querySelectorAll('ul').forEach(ul => {
      const items = Array.from(ul.children);
      const isMetaList = items.some(li => /<strong>\s*(论文标题|论文简称|作者团队|研究机构|公开日期|发表类型|学术层次标定|论文与代码链接|综合打分)\s*<\/strong>/.test(li.innerHTML));
      if (!isMetaList) return;

      const card = document.createElement('div');
      card.className = 'paper-meta-card';
      let scoreHtml = '';
      const grid = document.createElement('div');
      grid.className = 'meta-grid';

      items.forEach(li => {
        const text = li.innerHTML;
        const match = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim();
          if (key.includes('打分')) {
            const scoreParts = val.match(/^(\d+\s*\/\s*\d+)([\s\S]*)/);
            if (scoreParts) {
              const cleanSub = scoreParts[2].trim().replace(/^[（(]|[）)]$/g, '').replace(/,\s*/g, ' · ');
              scoreHtml = `
                <div class="meta-score-box">
                  <div class="score-header">
                    <span class="score-label">⭐ 学术综合评价打分</span>
                    <span class="score-highlight">${scoreParts[1].trim()}</span>
                  </div>
                  ${cleanSub ? `<div class="score-breakdown">${esc(cleanSub)}</div>` : ''}
                </div>
              `;
            } else {
              scoreHtml = `<div class="meta-score-box"><div class="score-label">⭐ 学术综合评价打分</div><div class="score-num">${val}</div></div>`;
            }
          } else {
            const row = document.createElement('div');
            row.className = 'meta-row';
            row.innerHTML = `<span class="meta-key">${key}</span><span class="meta-val">${val}</span>`;
            grid.append(row);
          }
        }
      });
      if (scoreHtml) {
        card.innerHTML = scoreHtml;
      }
      card.append(grid);
      ul.replaceWith(card);
    });

    // Beautify ASCII architecture diagrams into blueprint cards
    target.querySelectorAll('pre').forEach(pre => {
      const text = pre.textContent;
      if (/[├└│▼─]/.test(text) && text.split('\n').length >= 3) {
        const card = document.createElement('div');
        card.className = 'diagram-card';
        card.innerHTML = `
          <div class="diagram-header">
            <span>📐 核心架构与信息流图</span>
            <span class="diagram-badge">Architecture Blueprint</span>
          </div>
        `;
        const newPre = document.createElement('pre');
        newPre.className = 'diagram-body';
        newPre.textContent = text;
        card.append(newPre);
        pre.replaceWith(card);
      }
    });

    // 1. Transform [TOOL-xxx] sections into Tool Cards
    const parsedTools = [];
    target.querySelectorAll('h3').forEach(h3 => {
      const rawText = h3.textContent.trim();
      const idMatch = rawText.match(/\[(TOOL-\d+)\]/);
      if (!idMatch) return;
      const toolId = idMatch[1];
      const afterId = rawText.replace(/\[TOOL-\d+\]\s*/, '').trim();
      const splitMatch = afterId.match(/^(.*?)(?:\s+[—–]\s+|\s+--\s+|\s+-\s+)(.*)$/);
      const toolName = splitMatch ? splitMatch[1].trim() : afterId;
      const toolDesc = splitMatch ? splitMatch[2].trim() : '';

      let next = h3.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-4]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;

      const ul = next;
      const items = {};
      ul.querySelectorAll(':scope > li').forEach(li => {
        const text = li.innerHTML;
        const m = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (m) items[m[1].trim()] = m[2].trim();
      });

      const advice = items['建议'] || '';
      const status = items['实际试用状态'] || '未试用';
      const type = items['类型'] || '';
      const version = items['版本与发布日期'] || '';
      const link = items['项目链接'] || '';
      const date = items['核验日期'] || '';
      const usage = items['具体用途'] || '';
      const increment = items['相对已有能力的增量'] || '';
      const constraints = items['成本与兼容性'] || '';
      const evidence = items['证据范围'] || '';
      const nextStep = items['具体下一步'] || '';

      parsedTools.push({
        id: toolId,
        name: toolName,
        desc: toolDesc,
        advice,
        status,
        type,
        version,
        link,
        date,
        usage,
        increment,
        constraints,
        evidence,
        nextStep
      });

      const card = document.createElement('section');
      card.className = 'tool-card';
      card.id = toolId;
      card.setAttribute('data-advice', advice.includes('值得') ? 'recommended' : 'watch');
      card.setAttribute('data-type', type);

      card.innerHTML = `
        <div class="tool-card-header">
          <div class="tool-title-wrap">
            <span class="tool-badge">${esc(toolId)}</span>
            <h3 class="tool-name">${esc(toolName)}</h3>
            ${type ? `<span class="tool-category-badge">🏷️ ${esc(type)}</span>` : ''}
          </div>
          <div class="tool-status-wrap">
            ${advice ? `<span class="tool-advice-pill ${advice.includes('值得') ? 'is-recommended' : 'is-watch'}">${advice.includes('值得') ? '⭐ 强烈推荐试用' : '👀 持续跟踪观察'}</span>` : ''}
            <span class="tool-status-pill">⏳ ${esc(status)}</span>
          </div>
        </div>
        ${toolDesc ? `<div class="tool-desc">${esc(toolDesc)}</div>` : ''}
        
        <div class="tool-meta-bar">
          ${version ? `<div class="meta-bar-item"><span>📦 版本发布</span><strong>${esc(version)}</strong></div>` : ''}
          ${date ? `<div class="meta-bar-item"><span>📅 研判核验</span><strong>${esc(date)}</strong></div>` : ''}
          ${link ? `<div class="meta-bar-item meta-bar-link"><span>🔗 项目主页</span>${link}</div>` : ''}
        </div>

        <div class="tool-core-grid">
          ${usage ? `
            <div class="tool-block block-usage">
              <div class="tool-block-header">
                <span class="block-icon">💡</span>
                <span class="block-title">核心用途与业务价值</span>
              </div>
              <div class="tool-block-content">${usage}</div>
            </div>
          ` : ''}
          ${increment ? `
            <div class="tool-block block-increment">
              <div class="tool-block-header">
                <span class="block-icon">⚡</span>
                <span class="block-title">相对已有能力的显著增量</span>
              </div>
              <div class="tool-block-content">${increment}</div>
            </div>
          ` : ''}
        </div>

        ${(constraints || evidence) ? `
          <div class="tool-sub-grid">
            ${constraints ? `
              <div class="tool-sub-item">
                <div class="sub-label">🛡️ 成本、兼容性与部署要求</div>
                <div class="sub-val">${constraints}</div>
              </div>
            ` : ''}
            ${evidence ? `
              <div class="tool-sub-item">
                <div class="sub-label">🔍 证据范围与验证基准</div>
                <div class="sub-val">${evidence}</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${nextStep ? `
          <div class="tool-next-step">
            <span class="next-step-badge">🎯 具体下一步验证动作</span>
            <span class="next-step-text">${nextStep}</span>
          </div>
        ` : ''}
      `;

      h3.replaceWith(card);
      ul.remove();
    });

    // In tool_watch page: insert Radar Dashboard & Matrix at the top
    if (parsedTools.length > 0) {
      const h2Record = Array.from(target.querySelectorAll('h2')).find(h => h.textContent.includes('条目记录'));
      const recCount = parsedTools.filter(t => t.advice.includes('值得')).length;
      const watchCount = parsedTools.filter(t => !t.advice.includes('值得')).length;

      const matrixRows = parsedTools.map(t => `
        <tr class="matrix-row" data-advice="${t.advice.includes('值得') ? 'recommended' : 'watch'}">
          <td class="cell-mono"><a href="#${t.id}" class="badge-idea-id">${t.id}</a></td>
          <td class="cell-nowrap"><strong>${esc(t.name)}</strong></td>
          <td class="cell-nowrap"><span class="badge-domain">${esc(t.type.split('、')[0].split('/')[0])}</span></td>
          <td class="cell-nowrap"><span class="tool-advice-pill ${t.advice.includes('值得') ? 'is-recommended' : 'is-watch'}">${t.advice.includes('值得') ? '⭐ 推荐试用' : '👀 持续关注'}</span></td>
          <td class="cell-desc">${esc(t.desc || t.usage.slice(0, 48) + '...')}</td>
          <td class="cell-nowrap">${t.link ? `<span class="btn-table-action">${t.link}</span>` : '<span class="cell-muted">—</span>'}</td>
          <td class="cell-nowrap"><a href="#${t.id}" class="btn-jump-card">详情卡片 ↓</a></td>
        </tr>
      `).join('');

      const dashboard = document.createElement('div');
      dashboard.className = 'radar-dashboard-wrap';
      dashboard.innerHTML = `
        <div class="radar-hero">
          <div class="radar-hero-badge">
            <span class="radar-pulse"></span>
            <span>TECH RADAR · 多模态融合科研工具雷达</span>
          </div>
          <h2 class="radar-hero-title">科研工具、Skill 与前沿技术资讯雷达</h2>
          <p class="radar-hero-desc">
            追踪与研判 IVIF 计算机视觉、多模态融合、生成式流匹配、非欧黎曼几何及工程自动化工具。多维评估运行成本、显存开销与技术增量，为论文复现与机理创新提供武器库。
          </p>

          <div class="radar-stats-grid">
            <div class="radar-stat-box is-active" data-filter="all">
              <div class="stat-num">${parsedTools.length}</div>
              <div class="stat-meta">🛠️ 纳管工具总数</div>
            </div>
            <div class="radar-stat-box box-recommended" data-filter="recommended">
              <div class="stat-num">${recCount}</div>
              <div class="stat-meta">⭐ 重点推荐试用</div>
            </div>
            <div class="radar-stat-box box-watch" data-filter="watch">
              <div class="stat-num">${watchCount}</div>
              <div class="stat-meta">👀 持续跟踪观察</div>
            </div>
            <div class="radar-stat-box box-pending" data-filter="pending">
              <div class="stat-num">${parsedTools.length}</div>
              <div class="stat-meta">⏳ 待排期实测验证</div>
            </div>
          </div>

          <div class="radar-filter-bar">
            <span class="filter-label">🔍 快速筛选：</span>
            <button class="chip-filter active" data-filter="all">全部工具 (${parsedTools.length})</button>
            <button class="chip-filter" data-filter="recommended">⭐ 重点推荐 (${recCount})</button>
            <button class="chip-filter" data-filter="watch">👀 持续跟踪 (${watchCount})</button>
          </div>
        </div>

        <div class="radar-matrix-section">
          <div class="matrix-header">
            <div class="matrix-title">📋 纳管工具全景一览矩阵 (At-a-Glance Matrix)</div>
            <div class="matrix-hint">点击卡片直达技术详情与验证动作</div>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>编号</th>
                  <th>工具名称</th>
                  <th>技术领域</th>
                  <th>推荐建议</th>
                  <th>核心亮点与攻关方向</th>
                  <th>项目资源</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                ${matrixRows}
              </tbody>
            </table>
          </div>
        </div>
      `;

      if (h2Record) {
        let p = h2Record.nextElementSibling;
        if (p && p.tagName === 'P' && p.textContent.includes('每条使用稳定')) p.remove();
        let prevP = h2Record.previousElementSibling;
        if (prevP && prevP.tagName === 'P' && prevP.textContent.includes('初始化日期')) prevP.remove();
        h2Record.replaceWith(dashboard);
      } else {
        target.prepend(dashboard);
      }

      // Filter click events
      dashboard.querySelectorAll('.chip-filter, .radar-stat-box').forEach(btn => {
        btn.onclick = () => {
          const filter = btn.getAttribute('data-filter');
          dashboard.querySelectorAll('.chip-filter').forEach(c => c.classList.toggle('active', c.getAttribute('data-filter') === filter));
          dashboard.querySelectorAll('.radar-stat-box').forEach(b => b.classList.toggle('is-active', b.getAttribute('data-filter') === filter));

          target.querySelectorAll('.tool-card').forEach(card => {
            const cardAdvice = card.getAttribute('data-advice');
            if (filter === 'all' || filter === 'pending') {
              card.style.display = '';
            } else if (filter === 'recommended') {
              card.style.display = cardAdvice === 'recommended' ? '' : 'none';
            } else if (filter === 'watch') {
              card.style.display = cardAdvice === 'watch' ? '' : 'none';
            }
          });

          dashboard.querySelectorAll('.matrix-row').forEach(row => {
            const rowAdvice = row.getAttribute('data-advice');
            if (filter === 'all' || filter === 'pending') {
              row.style.display = '';
            } else if (filter === 'recommended') {
              row.style.display = rowAdvice === 'recommended' ? '' : 'none';
            } else if (filter === 'watch') {
              row.style.display = rowAdvice === 'watch' ? '' : 'none';
            }
          });
        };
      });
    }

    // Transform [周度跟进] in tool_watch into Spotlight Callout Card
    target.querySelectorAll('h2').forEach(h2 => {
      if (!h2.textContent.includes('周度跟进')) return;
      let next = h2.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-2]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;
      const ul = next;
      const li = ul.querySelector('li');
      const text = li ? li.innerHTML : ul.innerHTML;

      const card = document.createElement('section');
      card.className = 'weekly-spotlight-card';
      card.id = h2.id;
      card.innerHTML = `
        <div class="spotlight-header">
          <div class="spotlight-badge-wrap">
            <span class="spotlight-badge">📢 周度推荐试用聚焦</span>
            <span class="spotlight-date">Weekly Spotlight Decision</span>
          </div>
          <h3 class="spotlight-title">周度技术攻关推进建议</h3>
        </div>
        <div class="spotlight-body">
          <div class="spotlight-lead">${text}</div>
        </div>
        <div class="spotlight-footer">
          <a href="#TOOL-001" class="btn-spotlight-jump">⚡ 查看首选推荐工具 TOOL-001 (Docling) 详情 →</a>
        </div>
      `;
      h2.replaceWith(card);
      ul.remove();
    });

    // 2. Transform [QUESTION-xxx] sections into Research Question Cards
    target.querySelectorAll('h3').forEach(h3 => {
      const qMatch = h3.textContent.match(/\[(QUESTION-\d+)\]\s*(.*)/);
      if (!qMatch) return;
      const qId = qMatch[1];
      const qTitle = qMatch[2].trim();

      let next = h3.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-4]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;

      const ul = next;
      const items = {};
      ul.querySelectorAll(':scope > li').forEach(li => {
        const text = li.innerHTML;
        const m = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (m) items[m[1].trim()] = m[2].trim();
      });

      const card = document.createElement('section');
      card.className = 'question-card';
      card.id = h3.id;

      card.innerHTML = `
        <div class="q-header">
          <div class="q-badge-wrap">
            <span class="q-badge">${esc(qId)}</span>
            ${items['记录日期'] ? `<span class="q-date">📅 ${esc(items['记录日期'])}</span>` : ''}
            ${items['来源与位置'] ? `<span class="q-source">📄 ${items['来源与位置']}</span>` : ''}
          </div>
          <div class="q-title">${esc(qTitle)}</div>
        </div>
        ${items['已知事实'] ? `
          <div class="q-block q-facts">
            <div class="q-block-label">🔍 已知事实与核心失效矛盾</div>
            <div class="q-block-content">${items['已知事实']}</div>
          </div>
        ` : ''}
        ${items['待验证解释'] ? `
          <div class="q-block q-hypothesis">
            <div class="q-block-label">💡 待验证科学解释与机理突破</div>
            <div class="q-block-content">${items['待验证解释']}</div>
          </div>
        ` : ''}
        <div class="q-footer">
          ${items['关联论文与 Idea'] ? `
            <div class="q-footer-item">
              <span class="footer-label">🔗 关联论文与假设：</span>
              <span>${items['关联论文与 Idea']}</span>
            </div>
          ` : ''}
          ${items['下一步'] ? `
            <div class="q-footer-item q-next">
              <span class="footer-label">🎯 下一步验证动作：</span>
              <span>${items['下一步']}</span>
            </div>
          ` : ''}
        </div>
      `;

      h3.replaceWith(card);
      ul.remove();
    });

    // 3. Transform [IDEA-xxx] sections into Hypothesis & Mechanism Cards
    target.querySelectorAll('h3').forEach(h3 => {
      const ideaMatch = h3.textContent.match(/\[(IDEA-\d+)\]\s*(.*)/);
      if (!ideaMatch) return;
      const ideaId = ideaMatch[1];
      const ideaTitle = ideaMatch[2].trim();

      let next = h3.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-4]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;

      const ul = next;
      const items = {};
      ul.querySelectorAll(':scope > li').forEach(li => {
        const text = li.innerHTML;
        const m = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (m) items[m[1].trim()] = m[2].trim();
      });

      const card = document.createElement('section');
      card.className = 'idea-card';
      card.id = h3.id;

      card.innerHTML = `
        <div class="idea-header">
          <div class="idea-badge-wrap">
            <span class="idea-badge">${esc(ideaId)}</span>
            <span class="idea-status-pill">PROPOSED 待验证假设</span>
          </div>
          <div class="idea-title">${esc(ideaTitle)}</div>
        </div>
        ${items['当前假设'] ? `
          <div class="idea-block">
            <div class="idea-label">🔬 核心假设与力学/物理映射</div>
            <div class="idea-body">${items['当前假设']}</div>
          </div>
        ` : ''}
        <div class="idea-two-col">
          ${items['成立条件'] ? `
            <div class="idea-mini-block">
              <div class="mini-label">✅ 理论成立条件</div>
              <div class="mini-body">${items['成立条件']}</div>
            </div>
          ` : ''}
          ${items['可区分预测'] ? `
            <div class="idea-mini-block">
              <div class="mini-label">📊 可区分预期效果</div>
              <div class="mini-body">${items['可区分预测']}</div>
            </div>
          ` : ''}
        </div>
        ${items['替代解释与区分对照'] ? `
          <div class="idea-mini-block idea-control">
            <div class="mini-label">⚖️ 替代解释与严谨负对照设计</div>
            <div class="mini-body">${items['替代解释与区分对照']}</div>
          </div>
        ` : ''}
        ${items['否定条件'] ? `
          <div class="idea-mini-block idea-falsify">
            <div class="mini-label">❌ 证伪否定判据 (何时放弃该假设)</div>
            <div class="mini-body">${items['否定条件']}</div>
          </div>
        ` : ''}
        ${items['下一步最小验证方案'] ? `
          <div class="idea-next-step">
            <span class="next-step-badge">🚀 最小验证方案 (MVP)</span>
            <span class="next-step-text">${items['下一步最小验证方案']}</span>
          </div>
        ` : ''}
      `;

      h3.replaceWith(card);
      ul.remove();
    });

    // 4. Transform [CARD-IDEA-xxx] sections into Paper Argument Cards
    target.querySelectorAll('h3').forEach(h3 => {
      const cardMatch = h3.textContent.match(/\[(CARD-IDEA-\d+)\]\s*(.*)/);
      if (!cardMatch) return;
      const cardId = cardMatch[1];
      const cardTitle = cardMatch[2].trim();

      let next = h3.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-4]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;

      const ul = next;
      const items = {};
      ul.querySelectorAll(':scope > li').forEach(li => {
        const text = li.innerHTML;
        const m = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (m) items[m[1].trim()] = m[2].trim();
      });

      const card = document.createElement('section');
      card.className = 'argument-card';
      card.id = h3.id;

      card.innerHTML = `
        <div class="arg-header">
          <div class="arg-badge-wrap">
            <span class="arg-badge">${esc(cardId)}</span>
            <span class="arg-pill">论文论证卡 · Defense Blueprint</span>
          </div>
          <div class="arg-title">${esc(cardTitle)}</div>
        </div>
        <div class="arg-grid">
          ${items['具体问题与价值'] || items['一句话论文主张'] ? `
            <div class="arg-item item-highlight">
              <div class="arg-label">🎯 论文核心主张与问题价值</div>
              <div class="arg-val">${items['具体问题与价值'] || items['一句话论文主张']}</div>
            </div>
          ` : ''}
          ${items['现有方法不足'] ? `
            <div class="arg-item item-flaw">
              <div class="arg-label">⚠️ 现有方法核心局限与不足</div>
              <div class="arg-val">${items['现有方法不足']}</div>
            </div>
          ` : ''}
          ${items['核心假设与候选贡献'] ? `
            <div class="arg-item item-hypothesis">
              <div class="arg-label">💡 核心假设与主要创新贡献</div>
              <div class="arg-val">${items['核心假设与候选贡献']}</div>
            </div>
          ` : ''}
          ${items['主张与证据对照'] ? `
            <div class="arg-item">
              <div class="arg-label">⚖️ 主张与实验证据严格对照链</div>
              <div class="arg-val">${items['主张与证据对照']}</div>
            </div>
          ` : ''}
          ${items['所需实验与图表骨架'] || items['核心图设计'] ? `
            <div class="arg-item">
              <div class="arg-label">📊 支撑论文的实验矩阵与图表骨架</div>
              <div class="arg-val">${items['所需实验与图表骨架'] || items['核心图设计']}</div>
            </div>
          ` : ''}
          ${items['写作素材与下一步'] || items['防御重点'] ? `
            <div class="arg-item item-next">
              <div class="arg-label">🚀 论文写作素材与下一步行动</div>
              <div class="arg-val">${items['写作素材与下一步'] || items['防御重点']}</div>
            </div>
          ` : ''}
        </div>
      `;

      h3.replaceWith(card);
      ul.remove();
    });

    // 5. Transform [周度跨论文综合] sections into Weekly Research Synthesis Cards
    target.querySelectorAll('h2').forEach(h2 => {
      if (!h2.textContent.includes('周度跨论文综合')) return;
      let next = h2.nextElementSibling;
      while (next && next.tagName !== 'UL' && !/^H[1-2]$/.test(next.tagName)) {
        next = next.nextElementSibling;
      }
      if (!next || next.tagName !== 'UL') return;

      const ul = next;
      const items = {};
      ul.querySelectorAll(':scope > li').forEach(li => {
        const text = li.innerHTML;
        const m = text.match(/<strong>\s*(.*?)\s*<\/strong>[：:]([\s\S]*)/);
        if (m) items[m[1].trim()] = m[2].trim();
      });

      const card = document.createElement('section');
      card.className = 'weekly-synthesis-card';
      card.id = h2.id;
      const titleText = h2.textContent.replace(/^#+\s*/, '').trim();

      card.innerHTML = `
        <div class="synthesis-header">
          <div class="synthesis-badge-wrap">
            <span class="synthesis-badge">📊 周度科研综合态势报告</span>
            <span class="synthesis-cycle">Weekly Synthesis</span>
          </div>
          <h2 class="synthesis-title">${esc(titleText)}</h2>
          ${items['综合范围'] ? `<div class="synthesis-scope"><strong>研读切片范围：</strong>${items['综合范围']}</div>` : ''}
        </div>
        <div class="synthesis-grid">
          ${items['共同问题'] || items['共同问题与范式跃迁'] ? `
            <div class="synthesis-col col-consensus">
              <div class="col-header">
                <span class="col-icon">🧭</span>
                <span class="col-title">共识演进与范式跃迁</span>
              </div>
              <div class="col-body">${items['共同问题'] || items['共同问题与范式跃迁']}</div>
            </div>
          ` : ''}
          ${items['不同解释与证据分歧'] || items['机制分歧与未决矛盾'] ? `
            <div class="synthesis-col col-controversy">
              <div class="col-header">
                <span class="col-icon">⚡</span>
                <span class="col-title">机制分歧与未决矛盾</span>
              </div>
              <div class="col-body">${items['不同解释与证据分歧'] || items['机制分歧与未决矛盾']}</div>
            </div>
          ` : ''}
        </div>
        <div class="synthesis-actions">
          ${items['本周推进建议'] || items['本周集中深化建议'] ? `
            <div class="synthesis-action-item action-focus">
              <div class="action-label">💡 本周集中深化建议</div>
              <div class="action-body">${items['本周推进建议'] || items['本周集中深化建议']}</div>
            </div>
          ` : ''}
          ${items['下一步最能区分机理的行动'] || items['下一步最能区分解释的行动'] ? `
            <div class="synthesis-action-item action-next">
              <div class="action-label">🎯 最能区分机理的验证动作</div>
              <div class="action-body">${items['下一步最能区分机理的行动'] || items['下一步最能区分解释的行动']}</div>
            </div>
          ` : ''}
        </div>
      `;

      h2.replaceWith(card);
      ul.remove();
    });
  }

  // INDEX VIEW
  if (data.kind === 'index') {
    const totalCount = data.entries.length;
    const latestDate = data.entries[0]?.date || '今日';
    const latestPaper = data.entries[0]?.paper_title ? data.entries[0].paper_title.split(/[:：]/)[0].trim() : '前沿精读';
    const latestPaperHref = data.entries[0]?.paper_href || data.entries[0]?.href || '2026-11-11/papers/dpofusion.html';

    app.innerHTML = `
      <section class="hero">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>IVIF 红外与可见光图像融合 · 每日开放探索</span>
        </div>
        <h1 class="hero-title">研究阅读室</h1>
        <p class="hero-lede">每天精读一篇高分前沿，深挖物理机理、严谨数学推导与可证伪假设。积跬步以致千里，持续构筑独立且富有洞察力的学术论证体系。</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-label">研报累计</div>
              <div class="stat-val">${totalCount} 期</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
              <div class="stat-label">最新一期</div>
              <div class="stat-val">${esc(latestDate)}</div>
            </div>
          </div>
          <a href="${esc(latestPaperHref)}" class="stat-card stat-card-interactive" style="text-decoration:none;cursor:pointer;">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-label">今日焦点 <span style="font-size:11px;opacity:0.8;">(点击直达)</span></div>
              <div class="stat-val" style="color:var(--accent);">${esc(latestPaper)}</div>
            </div>
          </a>
          <a href="submission_calendar_180d.html" class="stat-card stat-card-interactive" id="hero-countdown-card" style="text-decoration:none;cursor:pointer;">
            <div class="stat-icon" id="hero-countdown-icon">🚨</div>
            <div class="stat-content">
              <div class="stat-label" id="hero-countdown-label">CVPR 2027 倒计时</div>
              <div class="stat-val" id="hero-countdown-val" style="color:#ef4444;">计算中...</div>
            </div>
          </a>
        </div>

        <div class="quick-links-bar">
          <a href="submission_calendar_180d.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(239, 68, 68, 0.12);color:#f87171;">📅</span>
              <div class="quick-link-text">
                <div class="quick-link-title">未来 180 天投稿日历</div>
                <div class="quick-link-desc">CVPR / ICME 严格北京时间截稿甘特</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
          <a href="idea_log.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(245, 158, 11, 0.12);color:#fbbf24;">💡</span>
              <div class="quick-link-text">
                <div class="quick-link-title">跨学科 Idea 台账</div>
                <div class="quick-link-desc">非欧光锥因果、功能梯度材料迁移</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
          <a href="research_threads.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(56, 189, 248, 0.12);color:#38bdf8;">🧭</span>
              <div class="quick-link-text">
                <div class="quick-link-title">研究脉络与周度综合</div>
                <div class="quick-link-desc">关键科学疑问追踪与论证骨架卡</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
          <a href="tool_watch.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(168, 85, 247, 0.12);color:#c084fc;">🛠️</span>
              <div class="quick-link-text">
                <div class="quick-link-title">工具与技术雷达</div>
                <div class="quick-link-desc">Geoopt 黎曼流形微分、KaTeX 数学渲染</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
          <a href="venue_tiers.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(45, 212, 191, 0.12);color:#2dd4bf;">📊</span>
              <div class="quick-link-text">
                <div class="quick-link-title">顶刊顶会评级与分区</div>
                <div class="quick-link-desc">CCF第七版与中科院一区TOP指南</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
          <a href="read_log.html" class="quick-link-card">
            <div class="quick-link-info">
              <span class="quick-link-icon" style="background:rgba(148, 163, 184, 0.12);color:#cbd5e1;">📚</span>
              <div class="quick-link-text">
                <div class="quick-link-title">已精读论文台账</div>
                <div class="quick-link-desc">历史研报打分与一句话核心结论</div>
              </div>
            </div>
            <span class="quick-link-arrow">›</span>
          </a>
        </div>
      </section>

      <div class="toolbar-wrap">
        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
            <input id="search" aria-label="搜索日期、主题或论文" placeholder="搜索日期、标题、论文、关键词（如：双曲空间、流匹配、CVPR）...">
          </div>
          <div class="toolbar-sub">
            <div class="filter-pills" id="filter-pills">
              <button class="filter-pill is-active" data-val="all">全部 (${totalCount})</button>
              <button class="filter-pill" data-val="unread">📌 未读</button>
              <button class="filter-pill" data-val="read">✓ 已读</button>
            </div>
            <span id="counter" class="counter-badge">共 ${totalCount} 篇</span>
          </div>
        </div>
      </div>

      <div id="entries"></div>
      <div class="footer">💡 阅读标记仅保存在当前浏览器本地；已读不代表已完全掌握，建议结合精读与代码复核。</div>
    `;

    const searchInput = document.getElementById('search');
    const counterBadge = document.getElementById('counter');
    let currentFilter = 'all';

    const filterPillsContainer = document.getElementById('filter-pills');
    if (filterPillsContainer) {
      filterPillsContainer.querySelectorAll('.filter-pill').forEach(btn => {
        btn.onclick = () => {
          if (navigator.vibrate) navigator.vibrate(10);
          filterPillsContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          currentFilter = btn.dataset.val || 'all';
          draw();
        };
      });
    }

    const updateHeroCountdown = () => {
      const iconEl = document.getElementById('hero-countdown-icon');
      const labelEl = document.getElementById('hero-countdown-label');
      const valEl = document.getElementById('hero-countdown-val');
      if (!valEl) return;

      const upcoming = VENUE_DEADLINES.filter(v => v.deadlineUtcMs > Date.now());
      if (upcoming.length === 0) {
        if (iconEl) iconEl.textContent = '🏁';
        if (labelEl) labelEl.textContent = '本轮截稿已完毕';
        valEl.textContent = '关注后续特刊';
        valEl.style.color = 'var(--ink-muted)';
        return;
      }

      const next = upcoming[0];
      const info = getCountdownInfo(next.deadlineUtcMs);
      if (iconEl) {
        if (info.status === 'tonight') iconEl.textContent = '🔥';
        else if (info.status === 'sprint') iconEl.textContent = '⚡';
        else iconEl.textContent = '📅';
      }
      if (labelEl) labelEl.textContent = `${next.shortLabel || next.name} 倒计时`;
      valEl.innerHTML = info.shortStr;
      valEl.style.color = info.heroColor;
    };
    updateHeroCountdown();
    setInterval(updateHeroCountdown, 3000);

    const draw = () => {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const filter = currentFilter;
      const rows = data.entries.filter(e => {
        const read = storage.get('digest-read-' + e.date) === 'yes';
        const matchText = [e.date, e.title, e.paper_title || '', ...(e.tags || [])].join(' ').toLowerCase();
        const matchesQuery = !q || matchText.includes(q);
        const matchesFilter = filter === 'all' || (filter === 'read' ? read : !read);
        return matchesQuery && matchesFilter;
      });

      if (counterBadge) counterBadge.textContent = `共 ${rows.length} / ${totalCount} 篇`;

      document.getElementById('entries').innerHTML = rows.map((e) => {
        const read = storage.get('digest-read-' + e.date) === 'yes';
        const isLatest = e.date === latestDate;
        const paperHref = e.paper_href || (e.legacy ? null : `${e.date}/papers/${e.date}.html`);
        const appendixHref = e.appendix_href || `${e.date}/appendix.html`;

        return `
          <article class="entry-card">
            <div class="entry-header">
              <div class="entry-meta-left">
                <span class="date-pill">📅 ${esc(e.date)}</span>
                ${isLatest ? '<span class="badge-latest">✨ 今日最新</span>' : ''}
                <span class="status-pill ${e.legacy ? 'status-legacy' : 'status-success'}">
                  <span class="dot"></span>${esc(e.status)}${e.legacy ? ' · 历史归档' : ''}
                </span>
              </div>
              <button class="read-toggle ${read ? 'is-read' : 'is-unread'}" data-date="${esc(e.date)}">
                ${read ? '✓ 已读' : '○ 标为已读'}
              </button>
            </div>

            <h2 class="entry-title">
              <a href="${esc(e.href)}">${esc(e.title)}</a>
            </h2>

            ${e.paper_title ? `
              <div class="tldr-callout">
                <div class="tldr-badge-row">
                  <span class="tldr-badge">⚡ 核心精读论文</span>
                  <span class="tldr-score">★ 顶会高优</span>
                </div>
                <div class="tldr-title">${esc(e.paper_title)}</div>
              </div>
            ` : ''}

            ${e.tags && e.tags.length ? `
              <div class="tags-row">
                ${e.tags.map(t => `<button class="tag-chip" data-tag="${esc(t)}">#${esc(t)}</button>`).join('')}
              </div>
            ` : ''}

            <div class="entry-actions">
              <a href="${esc(e.href)}" class="btn-primary-action">📖 进入核心导读</a>
              ${paperHref ? `<a href="${esc(paperHref)}" class="btn-secondary-action">🔬 论文深度精读</a>` : ''}
              <div class="subtle-actions">
                ${!e.legacy ? `<a href="${esc(appendixHref)}" class="btn-ghost-action">附录</a>` : ''}
                <a href="${esc(e.href.replace('.html', '.md'))}" class="btn-ghost-action">MD</a>
              </div>
            </div>
          </article>
        `;
      }).join('') || '<div class="empty">暂无匹配的研报。尝试更换搜索关键词或筛选状态。</div>';

      // Read toggles
      app.querySelectorAll('[data-date]').forEach(b => {
        b.onclick = (ev) => {
          ev.stopPropagation();
          if (navigator.vibrate) navigator.vibrate(10);
          const key = 'digest-read-' + b.dataset.date;
          storage.set(key, storage.get(key) === 'yes' ? 'no' : 'yes');
          draw();
        };
      });

      // Tag chips click to filter
      app.querySelectorAll('[data-tag]').forEach(chip => {
        chip.onclick = () => {
          if (navigator.vibrate) navigator.vibrate(10);
          searchInput.value = chip.dataset.tag;
          draw();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
      });
    };

    if (searchInput) searchInput.oninput = draw;
    draw();
    return;
  }

  // ==========================================================================
  // ARTICLE VIEW (BEAUTIFIED & COMPONENTIZED)
  // ==========================================================================
  const charCount = (data.markdown || '').length;
  const readMinutes = Math.max(1, Math.round(charCount / 380));

  // Determine relative links for the 3 tabs: digest, paper, appendix
  let digestHref = data.digest_href;
  let paperHref = data.paper_href;
  let appendixHref = data.appendix_href;
  
  if (!digestHref) {
    if (data.back) digestHref = data.back;
    else if (data.paper) digestHref = 'digest.html';
  }
  if (!appendixHref && data.appendix) appendixHref = data.appendix;
  if (!paperHref && data.paper) paperHref = data.paper;

  const pageType = data.page_type || (data.paper ? 'digest' : (data.source && data.source.includes('appendix') ? 'appendix' : 'paper'));
  const pageLabel = pageType === 'digest' ? '核心导读' : (pageType === 'appendix' ? '来源与运行记录' : (pageType === 'paper' ? '论文深度精读' : '研究文章'));
  const isToolLedger = data.date === '研究台账';

  app.innerHTML = `
    <header class="detail-hero">
      <div class="breadcrumb-bar">
        <a href="${esc(homeHref)}" class="breadcrumb-link">🏠 研究阅读室</a>
        <span class="breadcrumb-sep">/</span>
        ${isToolLedger ? `
          <span class="breadcrumb-current">${esc(data.title)}</span>
        ` : `
          <span>${esc(data.date)}</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${pageLabel}</span>
        `}
      </div>

      <div class="detail-header-main">
        <div class="detail-meta-row">
          <span class="date-pill">📅 ${esc(data.date)}</span>
          <span class="status-pill ${data.legacy ? 'status-legacy' : 'status-success'}"><span class="dot"></span>${esc(data.status)}</span>
          <span class="read-estimate">⏱️ 约 ${readMinutes} 分钟精读 · ${charCount.toLocaleString()} 字符</span>
        </div>
        <h1 class="detail-title">${esc(data.title)}</h1>
      </div>

      ${!isToolLedger ? `
        <nav class="tabs-nav" aria-label="当日研报分卷">
          ${digestHref ? `
            <a href="${esc(digestHref)}" class="tab-item ${pageType === 'digest' ? 'active' : ''}">
              <span>📖</span> 当日核心导读
            </a>
          ` : ''}
          ${paperHref ? `
            <a href="${esc(paperHref)}" class="tab-item ${pageType === 'paper' ? 'active' : ''}">
              <span>🔬</span> 论文深度精读
            </a>
          ` : ''}
          ${appendixHref ? `
            <a href="${esc(appendixHref)}" class="tab-item ${pageType === 'appendix' ? 'active' : ''}">
              <span>📋</span> 来源与记录
            </a>
          ` : ''}
          <a href="${esc(data.source)}" class="tab-item tab-ghost">
            <span>📄</span> Markdown 原稿
          </a>
        </nav>
      ` : `
        <nav class="tabs-nav tool-tabs-nav" aria-label="研究台账快捷切换">
          <a href="${esc(homeHref)}" class="tab-item">🏠 返回首页</a>
          <a href="submission_calendar_180d.html" class="tab-item ${data.source && data.source.includes('submission_calendar') ? 'active' : ''}">📅 投稿日历</a>
          <a href="idea_log.html" class="tab-item ${data.source && data.source.includes('idea_log') ? 'active' : ''}">💡 Idea台账</a>
          <a href="research_threads.html" class="tab-item ${data.source && data.source.includes('research_threads') ? 'active' : ''}">🧭 研究脉络</a>
          <a href="venue_tiers.html" class="tab-item ${data.source && data.source.includes('venue_tiers') ? 'active' : ''}">📊 评级分区</a>
          <a href="tool_watch.html" class="tab-item ${data.source && data.source.includes('tool_watch') ? 'active' : ''}">🛠️ 工具雷达</a>
          <a href="read_log.html" class="tab-item ${data.source && data.source.includes('read_log') ? 'active' : ''}">📚 精读台账</a>
          <a href="${esc(data.source)}" class="tab-item tab-ghost">📄 Markdown 原稿</a>
        </nav>
      `}
    </header>

    ${data.legacy ? '<div class="notice">⚠️ 这是历史原稿的阅读视图。内容未重新核验，长章节默认收起；原始 Markdown 保持原样。</div>' : ''}

    <div class="layout">
      <article class="article content"></article>
      <aside class="toc" aria-label="文章目录">
        <div class="toc-title">📑 本页目录</div>
        <nav class="toc-nav"></nav>
        <button class="toc-top-btn" id="btn-to-top">↑ 回到顶部</button>
      </aside>
    </div>

    <div class="footer">💡 来源与推测以正文标注为准。阅读完成后可回到首页标记已读。</div>
  `;

  const article = app.querySelector('article');
  renderMarkdown(data.markdown, article);

  // Live Dynamic Countdown Engine for Submission Calendar
  if (data.source && data.source.includes('submission_calendar')) {
    const initCalendarEngine = () => {
      // 1. Live Clock Banner before the first table
      const firstTableScroll = article.querySelector('.table-scroll');
      if (firstTableScroll && !document.getElementById('live-clock-banner')) {
        const banner = document.createElement('div');
        banner.id = 'live-clock-banner';
        banner.className = 'live-clock-banner';
        banner.innerHTML = `
          <span class="pulse-dot"></span>
          <span>当前系统动态时钟：<span class="clock-time" id="live-clock-time">...</span></span>
          <span class="clock-tag">Asia/Shanghai (UTC+8) · 毫秒级动态倒计时已挂载</span>
        `;
        firstTableScroll.before(banner);
      }

      // 2. Dynamic row updater
      const updateCalendarRows = () => {
        const now = Date.now();
        const clockEl = document.getElementById('live-clock-time');
        if (clockEl) {
          clockEl.textContent = formatBeijingTime(new Date(now));
        }

        // Iterate through all tables
        article.querySelectorAll('table').forEach(table => {
          const ths = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
          const countdownCol = ths.findIndex(h => /倒计时/i.test(h));
          const alertCol = ths.findIndex(h => /预警|等级/i.test(h));
          const timeCol = ths.findIndex(h => /换算北京时间|截稿日期/i.test(h));

          const rows = Array.from(table.querySelectorAll('tbody tr'));
          rows.forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length < 5) return;

            const venueText = cells[0].textContent.trim();
            const cleanText = venueText.toLowerCase().replace(/[\*\_\(\)\s]/g, '');

            // Match by venue name alias
            let match = VENUE_DEADLINES.find(v =>
              v.matchNames.some(m => cleanText.includes(m.toLowerCase().replace(/[\*\_\(\)\s]/g, '')))
            );

            let deadlineUtcMs = match ? match.deadlineUtcMs : null;

            // If not matched by name, check if time column has a parseable date
            if (!deadlineUtcMs && timeCol >= 0 && cells[timeCol]) {
              const dateStr = cells[timeCol].textContent.trim();
              const m = dateStr.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/);
              if (m) {
                const p = m[1].split('-').map(Number);
                const t = m[2].split(':').map(Number);
                deadlineUtcMs = Date.UTC(p[0], p[1] - 1, p[2], t[0] - 8, t[1], t[2]);
              }
            }

            if (deadlineUtcMs) {
              const info = getCountdownInfo(deadlineUtcMs);
              if (countdownCol >= 0 && cells[countdownCol]) {
                cells[countdownCol].innerHTML = info.countdownHtml;
                cells[countdownCol].classList.add('cell-nowrap');
              }
              if (alertCol >= 0 && cells[alertCol]) {
                cells[alertCol].innerHTML = countdownCol >= 0 ? info.badgeHtml : `${info.badgeHtml} ${info.countdownHtml}`;
                cells[alertCol].classList.add('cell-nowrap');
              }
              if (info.isExpired) {
                tr.classList.add('row-expired');
              } else {
                tr.classList.remove('row-expired');
              }
            }
          });
        });
      };

      updateCalendarRows();
      setInterval(updateCalendarRows, 1000);
    };

    initCalendarEngine();
  }

  // Generate unique IDs for Headings
  const used = new Set();
  const headings = article.querySelectorAll('h2, h3');
  headings.forEach(h => {
    const base = h.textContent.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-') || 'section';
    let id = base, n = 1; while (used.has(id)) id = base + '-' + n++; used.add(id); h.id = id;
  });

  // Populate Table of Contents
  const tocNav = app.querySelector('.toc-nav');
  if (tocNav) {
    headings.forEach(h => {
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = h.tagName.toLowerCase() === 'h3' ? 'toc-link toc-h3' : 'toc-link toc-h2';
      let title = h.textContent.trim();
      const toolMatch = title.match(/\[?(TOOL-\d+)\]?\s*(.*?)(?:\s+[—–]\s+|\s+--\s+|\s+-\s+|$)/);
      if (toolMatch && toolMatch[2]) {
        title = `${toolMatch[1]}: ${toolMatch[2].trim()}`;
      } else {
        const qMatch = title.match(/\[?(QUESTION-\d+)\]?\s*(.*)/);
        if (qMatch && qMatch[2]) {
          title = `${qMatch[1]}: ${qMatch[2].trim().slice(0, 16)}...`;
        } else {
          const ideaMatch = title.match(/\[?(CARD-IDEA-\d+|IDEA-\d+)\]?\s*(.*)/);
          if (ideaMatch && ideaMatch[2]) {
            title = `${ideaMatch[1]}: ${ideaMatch[2].trim().slice(0, 16)}...`;
          }
        }
      }
      a.textContent = title;
      tocNav.append(a);
    });

    // ScrollSpy using IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocNav.querySelectorAll('.toc-link').forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '0px 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // Back to top button
  const topBtn = document.getElementById('btn-to-top');
  if (topBtn) {
    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (data.legacy) {
    [...article.querySelectorAll('h2')].slice(1).forEach(h => {
      const details = document.createElement('details'), summary = document.createElement('summary');
      summary.textContent = h.textContent; h.before(details); details.append(summary);
      let next = h.nextSibling; h.remove();
      const body = document.createElement('div'); body.id = h.id; details.append(body);
      while (next && !(next.nodeType === 1 && next.tagName === 'H2')) {
        const after = next.nextSibling; body.append(next); next = after;
      }
    });
    if (tocNav) {
      tocNav.querySelectorAll('a').forEach(a => a.onclick = () => {
        const target = document.getElementById(a.hash.slice(1));
        if (target?.parentElement.tagName === 'DETAILS') target.parentElement.open = true;
      });
    }
  }
})();
