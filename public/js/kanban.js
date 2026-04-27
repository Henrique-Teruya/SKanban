/* ═══════════════════════════════════════════
   SKanban — Kanban Board
   ═══════════════════════════════════════════ */

const Kanban = {
  situacoes: [],
  atendimentos: [],
  refreshTimer: null,

  async init() {
    try {
      this.situacoes = await API.getSituacoes();
      this.renderColumns();
      await this.refresh();
      this.startAutoRefresh();
    } catch (err) {
      console.error('[Kanban] Init error:', err);
    }
  },

  renderColumns() {
    const board = Utils.$('#kanban-board');
    board.innerHTML = '';

    this.situacoes.forEach((sit, i) => {
      const col = document.createElement('div');
      col.className = 'kanban-column';
      col.dataset.situacaoId = sit.id;
      col.style.animationDelay = `${i * 0.06}s`;

      col.innerHTML = `
        <div class="kanban-column-header">
          <div class="kanban-column-title">
            <span class="dot" style="background:${sit.cor}"></span>
            <h3>${Utils.escapeHtml(sit.nome)}</h3>
          </div>
          <span class="kanban-column-count" data-count-for="${sit.id}">0</span>
        </div>
        <div class="kanban-cards" data-cards-for="${sit.id}"></div>
      `;

      // Drop zone events
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', (e) => {
        if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
      });
      col.addEventListener('drop', async (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const atId = parseInt(e.dataTransfer.getData('text/plain'));
        const newSitId = parseInt(col.dataset.situacaoId);
        await this.moveCard(atId, newSitId);
      });

      board.appendChild(col);
    });
  },

  async refresh() {
    try {
      const params = Filters.getParams();
      const searchVal = Utils.$('#search-input')?.value?.trim();
      if (searchVal) params.busca = searchVal;
      this.atendimentos = await API.getAtendimentos(params);
      this.distributeCards();
      this.updateSidebarCount();
    } catch (err) {
      console.error('[Kanban] Refresh error:', err);
    }
  },

  distributeCards() {
    // Clear all columns
    this.situacoes.forEach(sit => {
      const container = Utils.$(`[data-cards-for="${sit.id}"]`);
      if (container) container.innerHTML = '';
    });

    // Place cards
    this.situacoes.forEach(sit => {
      const cards = this.atendimentos.filter(a => a.situacao.id === sit.id);
      const container = Utils.$(`[data-cards-for="${sit.id}"]`);
      const countEl = Utils.$(`[data-count-for="${sit.id}"]`);

      if (countEl) countEl.textContent = cards.length;
      if (!container) return;

      if (cards.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg) var(--sp-sm)"><p style="font-size:var(--fs-micro)">Nenhum atendimento</p></div>';
        return;
      }

      cards.forEach((at, i) => {
        const cardEl = Card.render(at);
        cardEl.style.animationDelay = `${i * 0.03}s`;
        container.appendChild(cardEl);
      });
    });
  },

  async moveCard(atId, newSituacaoId) {
    const at = this.atendimentos.find(a => a.id === atId);
    if (!at || at.situacao.id === newSituacaoId) return;

    const oldSitId = at.situacao.id;
    const newSit = this.situacoes.find(s => s.id === newSituacaoId);

    // Optimistic update
    at.situacao = { id: newSit.id, nome: newSit.nome, cor: newSit.cor };
    this.distributeCards();

    try {
      await API.alterarSituacao(atId, newSituacaoId);
    } catch (err) {
      // Rollback
      const oldSit = this.situacoes.find(s => s.id === oldSitId);
      at.situacao = { id: oldSit.id, nome: oldSit.nome, cor: oldSit.cor };
      this.distributeCards();
      console.error('[Kanban] Move failed:', err);
    }
  },

  updateSidebarCount() {
    const countEl = Utils.$('#sidebar-kanban-count');
    if (countEl) {
      const abertos = this.atendimentos.filter(a => a.situacao.id !== 6).length;
      countEl.textContent = abertos;
    }
  },

  startAutoRefresh() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => this.refresh(), 30000);
  },

  stopAutoRefresh() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }
};
