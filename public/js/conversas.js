/* ═══════════════════════════════════════════
   SKanban — Conversas Controller
   ═══════════════════════════════════════════ */

const Conversas = {
  activeId: null,

  async init() {
    await this.renderList();
    if (this.activeId) this.select(this.activeId);
  },

  async renderList() {
    const container = Utils.$('#conversas-list-container');
    const badge = Utils.$('#conversas-total-badge');
    if (!container) return;

    container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg)"><p style="animation:pulse 1.5s infinite">Carregando...</p></div>';

    try {
      const atendimentos = await API.getAtendimentos();
      const ativos = atendimentos.filter(a => a.situacao.id !== 6); // Not finalized
      
      if (badge) badge.textContent = ativos.length;

      if (!ativos.length) {
        container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg)"><p>Nenhuma conversa ativa.</p></div>';
        return;
      }

      container.innerHTML = ativos.map(at => {
        const isActive = this.activeId === at.id ? 'active' : '';
        const channelClass = Utils.channelClass(at.canal);
        const isCritical = at.sla.horasDecorridas > at.sla.prazo;
        
        return `
          <div class="conversa-item ${isActive} ${isCritical ? 'critical' : ''}" onclick="Conversas.select(${at.id})" id="conv-item-${at.id}">
            <div class="conversa-item-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="priority-dot ${Utils.priorityClass(at.prioridade)}"></span>
                <span class="channel-icon-sm" style="color: var(--${channelClass})">${Utils.channelIcon(at.canal)}</span>
                <div>
                   <span class="conversa-item-name" style="color: var(--${channelClass})">${Utils.escapeHtml(at.cliente.nome)}</span>
                   <div class="conversa-item-subtitle">${Utils.escapeHtml(at.assunto.nome)}</div>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <span class="conversa-item-time">${Utils.formatTime(at.atualizadoEm)}</span>
                ${at.novasMensagens > 0 ? `<span class="badge-msg-count">${at.novasMensagens}</span>` : ''}
              </div>
            </div>
            <div class="conversa-item-body">
              ${at.situacao.id === 1 ? '<span class="status-badge new">Novo</span>' : ''}
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg)"><p>Erro ao carregar lista.</p></div>';
    }
  },

  async select(id) {
    this.activeId = id;
    
    // Update UI selection
    Utils.$$('.conversa-item').forEach(el => el.classList.remove('active'));
    const selected = Utils.$(`#conv-item-${id}`);
    if (selected) selected.classList.add('active');

    // Toggle views
    const placeholder = Utils.$('#conversas-timeline-placeholder');
    const container = Utils.$('#conversas-timeline-container');
    if (placeholder) placeholder.style.display = 'none';
    if (container) container.style.display = 'flex';

    // Load timeline (using the 'conversas' prefix for IDs)
    if (typeof Timeline !== 'undefined') {
      Timeline.load(id, 'conversas');
    }

    // Update Header
    try {
      const at = await API.getAtendimento(id);
      const header = Utils.$('#conversas-main-header');
      if (header) {
        const channelClass = Utils.channelClass(at.canal);
        header.innerHTML = `
          <div class="header-info">
            <span class="channel-icon-md" style="color: var(--${channelClass})">${Utils.channelIcon(at.canal)}</span>
            <div>
              <h4 style="color: var(--${channelClass})">${Utils.escapeHtml(at.cliente.nome)}</h4>
              <p>${Utils.escapeHtml(at.assunto.nome)} · ${Utils.escapeHtml(at.protocolo)}</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="hig-btn hig-btn-secondary hig-btn-sm" onclick="Modal.openDrawerById(${at.id})">Ver Detalhes</button>
          </div>
        `;
      }
    } catch (err) { console.error(err); }
  }
};
