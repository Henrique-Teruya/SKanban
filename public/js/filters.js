/* ═══════════════════════════════════════════
   SKanban — Filter Bar (Custom Dropdowns)
   ═══════════════════════════════════════════ */

const Filters = {
  active: {},

  async render() {
    const bar = Utils.$('#filter-bar');
    if (!bar) return;

    try {
      const assuntos = await API.getAssuntos();
      
      bar.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--sp-sm);">
          
          <!-- Plataforma Dropdown -->
          <div class="hig-dropdown" id="dropdown-canal">
            <button class="hig-filter-select" id="btn-filter-canal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:8px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Plataforma</span>
            </button>
            <div class="hig-dropdown-menu">
              <div class="hig-dropdown-item" data-value="">Todas as Plataformas</div>
              <div class="hig-dropdown-item" data-value="Email" style="color:var(--channel-email)">${Utils.channelIcon('Email')} Email</div>
              <div class="hig-dropdown-item" data-value="WhatsApp" style="color:var(--channel-whatsapp)">${Utils.channelIcon('WhatsApp')} WhatsApp</div>
              <div class="hig-dropdown-item" data-value="Portal do Cliente" style="color:var(--channel-portal)">${Utils.channelIcon('Portal do Cliente')} Portal</div>
              <div class="hig-dropdown-item" data-value="Interno" style="color:var(--channel-interno)">${Utils.channelIcon('Interno')} Interno</div>
              <div class="hig-dropdown-item" data-value="Pós-venda" style="color:var(--channel-posvenda)">${Utils.channelIcon('Pós-venda')} Pós-venda</div>
              <div class="hig-dropdown-item" data-value="Blip" style="color:var(--channel-blip)">${Utils.channelIcon('Blip')} Blip</div>
            </div>
          </div>

          <!-- Prioridade Dropdown -->
          <div class="hig-dropdown" id="dropdown-prioridade">
            <button class="hig-filter-select" id="btn-filter-prioridade">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Prioridade</span>
            </button>
            <div class="hig-dropdown-menu">
              <div class="hig-dropdown-item" data-value="">Todas as Prioridades</div>
              <div class="hig-dropdown-item" data-value="urgente"><span class="priority-dot priority-urgente"></span> Urgente</div>
              <div class="hig-dropdown-item" data-value="alta"><span class="priority-dot priority-alta"></span> Alta</div>
              <div class="hig-dropdown-item" data-value="media"><span class="priority-dot priority-media"></span> Média</div>
              <div class="hig-dropdown-item" data-value="baixa"><span class="priority-dot priority-baixa"></span> Baixa</div>
            </div>
          </div>

          <!-- Assunto Dropdown -->
          <div class="hig-dropdown" id="dropdown-assunto">
            <button class="hig-filter-select" id="btn-filter-assunto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:8px"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>Assunto</span>
            </button>
            <div class="hig-dropdown-menu">
              <div class="hig-dropdown-item" data-value="">Todos os Assuntos</div>
              ${assuntos.map(a => `<div class="hig-dropdown-item" data-value="${a.id}">${a.nome}</div>`).join('')}
            </div>
          </div>

          <button class="hig-btn-ghost hig-btn-sm" id="btn-clear-filters" style="display:none">Limpar Filtros</button>
        </div>
      `;

      this.setupDropdowns(bar);
      this.updateClearButton();

    } catch (err) { console.error('Erro ao renderizar filtros:', err); }
  },

  setupDropdowns(bar) {
    const dropdowns = Utils.$$('.hig-dropdown', bar);
    
    dropdowns.forEach(dd => {
      const btn = Utils.$('.hig-filter-select', dd);
      const menu = Utils.$('.hig-dropdown-menu', dd);
      const filterKey = dd.id.replace('dropdown-', '');

      btn.onclick = (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.contains('open');
        Utils.$$('.hig-dropdown').forEach(d => d.classList.remove('open'));
        if (!isOpen) dd.classList.add('open');
      };

      Utils.$$('.hig-dropdown-item', menu).forEach(item => {
        item.onclick = (e) => {
          e.stopPropagation();
          const value = item.dataset.value;
          const label = value ? item.textContent.trim() : filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
          
          if (value) {
            this.active[filterKey] = value;
            btn.classList.add('active');
            btn.querySelector('span').textContent = label;
          } else {
            delete this.active[filterKey];
            btn.classList.remove('active');
            btn.querySelector('span').textContent = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
          }

          dd.classList.remove('open');
          this.updateClearButton();
          Kanban.refresh();
        };
      });
    });

    document.addEventListener('click', () => {
      Utils.$$('.hig-dropdown').forEach(d => d.classList.remove('open'));
    });
  },

  updateClearButton() {
    const btn = Utils.$('#btn-clear-filters');
    if (!btn) return;
    btn.style.display = Object.keys(this.active).length > 0 ? 'block' : 'none';
  },

  getParams() {
    return { ...this.active };
  }
};
