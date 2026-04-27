/* ═══════════════════════════════════════════
   SKanban — Filter Bar
   ═══════════════════════════════════════════ */

const Filters = {
  active: {},

  render() {
    const bar = Utils.$('#filter-bar');
    if (!bar) return;

    bar.innerHTML = `
      <button class="hig-pill active" data-filter="todos">Todos</button>
      <div style="width:1px;height:20px;background:var(--border-subtle)"></div>
      <button class="hig-pill" data-filter="canal" data-value="Email">📧 Email</button>
      <button class="hig-pill" data-filter="canal" data-value="WhatsApp">💬 WhatsApp</button>
      <button class="hig-pill" data-filter="canal" data-value="Portal do Cliente">🌐 Portal</button>
      <button class="hig-pill" data-filter="canal" data-value="Interno">🏢 Interno</button>
      <button class="hig-pill" data-filter="canal" data-value="Pós-venda">🤝 Pós-venda</button>
      <div style="width:1px;height:20px;background:var(--border-subtle)"></div>
      <button class="hig-pill" data-filter="prioridade" data-value="urgente">🔴 Urgente</button>
      <button class="hig-pill" data-filter="prioridade" data-value="alta">🟠 Alta</button>
    `;

    bar.onclick = (e) => {
      const pill = e.target.closest('.hig-pill');
      if (!pill) return;

      const filter = pill.dataset.filter;
      const value = pill.dataset.value;

      if (filter === 'todos') {
        this.active = {};
        Utils.$$('.hig-pill', bar).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      } else {
        Utils.$('[data-filter="todos"]', bar).classList.remove('active');
        if (pill.classList.contains('active')) {
          pill.classList.remove('active');
          delete this.active[filter];
          if (Object.keys(this.active).length === 0) {
            Utils.$('[data-filter="todos"]', bar).classList.add('active');
          }
        } else {
          // Remove other pills of same filter type
          Utils.$$(`[data-filter="${filter}"]`, bar).forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.active[filter] = value;
        }
      }

      Kanban.refresh();
    };
  },

  getParams() {
    return { ...this.active };
  }
};
