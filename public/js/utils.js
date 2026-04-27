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
