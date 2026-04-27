/* ═══════════════════════════════════════════
   SKanban — Utility Helpers
   ═══════════════════════════════════════════ */

const Utils = {
  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  throttle(fn, ms = 100) {
    let last = 0;
    return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
  },

  escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  },

  getInitials(name) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  },

  avatarColor(name) {
    const colors = ['#0071e3', '#34c759', '#ff9f0a', '#af52de', '#ff3b30', '#5856d6', '#00b2ff', '#ff6482'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  },

  channelClass(canal) {
    const map = { 'Email': 'channel-email', 'WhatsApp': 'channel-whatsapp', 'Portal do Cliente': 'channel-portal',
      'Interno': 'channel-interno', 'Pós-venda': 'channel-posvenda', 'Blip': 'channel-blip' };
    return map[canal] || 'channel-interno';
  },

  channelIcon(canal) {
    const icons = {
      'Email': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      'WhatsApp': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 3.8.9L22 4l-1.5 5.5Z"/></svg>',
      'Portal do Cliente': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      'Interno': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      'Pós-venda': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      'Blip': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>'
    };
    return icons[canal] || icons['Interno'];
  },

  priorityClass(p) { return `priority-${p}`; },

  slaStatus(sla) {
    const pct = (sla.horasDecorridas / sla.prazo) * 100;
    if (pct >= 100) return 'sla-violated';
    if (pct >= 75) return 'sla-warning';
    return 'sla-ok';
  },

  slaPct(sla) { return Math.min((sla.horasDecorridas / sla.prazo) * 100, 100); },

  $(sel, ctx = document) { return ctx.querySelector(sel); },
  $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; },

  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') el.className = v;
      else if (k === 'innerHTML') el.innerHTML = v;
      else if (k === 'textContent') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else el.setAttribute(k, v);
    });
    children.forEach(c => { if (typeof c === 'string') el.append(c); else if (c) el.appendChild(c); });
    return el;
  }
};
