/* ═══════════════════════════════════════════
   SKanban — Modal & Drawer Manager
   ═══════════════════════════════════════════ */

const Modal = {
  openModal(contentHtml, opts = {}) {
    const overlay = Utils.$('#modal-overlay');
    const dialog = Utils.$('#modal-dialog');
    dialog.innerHTML = contentHtml;
    overlay.classList.add('open');

    const closeBtn = dialog.querySelector('[data-close]');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();
    overlay.onclick = (e) => { if (e.target === overlay) this.closeModal(); };
    document.addEventListener('keydown', this._escModal);
  },

  closeModal() {
    Utils.$('#modal-overlay').classList.remove('open');
    document.removeEventListener('keydown', this._escModal);
  },

  _escModal(e) { if (e.key === 'Escape') Modal.closeModal(); },

  // ── Drawer ──
  openDrawer(atendimento) {
    const overlay = Utils.$('#drawer-overlay');
    const drawer = Utils.$('#drawer');
    overlay.classList.add('open');

    requestAnimationFrame(() => drawer.classList.add('open'));

    this._renderDrawerContent(atendimento);

    overlay.onclick = () => this.closeDrawer();
    document.addEventListener('keydown', this._escDrawer);
  },

  async openDrawerById(id) {
    try {
      const at = await API.getAtendimento(id);
      this.openDrawer(at);
    } catch (err) { alert('Erro ao carregar detalhes: ' + err.message); }
  },

  closeDrawer() {
    const drawer = Utils.$('#drawer');
    drawer.classList.remove('open');
    setTimeout(() => Utils.$('#drawer-overlay').classList.remove('open'), 400);
    document.removeEventListener('keydown', this._escDrawer);
  },

  _escDrawer(e) { if (e.key === 'Escape') Modal.closeDrawer(); },

  _renderDrawerContent(at) {
    const header = Utils.$('#drawer-header-content');
    const avatarBg = Utils.avatarColor(at.responsavel.nome);
    const channelClass = Utils.channelClass(at.canal);

    header.innerHTML = `
      <div class="drawer-header-crm">
        <div class="crm-top">
          <div class="protocol">${Utils.escapeHtml(at.protocolo)}</div>
          <button class="hig-btn-icon hig-btn-secondary" onclick="Modal.closeDrawer()" style="margin-left: auto;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="crm-main">
          <h2>${Utils.escapeHtml(at.titulo)}</h2>
          <div class="crm-client-strip">
            <span class="client-name">${Utils.escapeHtml(at.cliente.nome)}</span>
            <span class="dot-sep"></span>
            <span class="channel-label ${channelClass}">${at.canal}</span>
          </div>
        </div>
        <div class="crm-meta-grid">
           <div class="meta-item">
             <label>Responsável</label>
             <div class="val">
               <span class="avatar-xs" style="background:${avatarBg}">${Utils.getInitials(at.responsavel.nome)}</span>
               ${Utils.escapeHtml(at.responsavel.nome)}
             </div>
           </div>
           <div class="meta-item">
             <label>Prioridade</label>
             <div class="val"><span class="priority-dot ${Utils.priorityClass(at.prioridade)}"></span>${at.prioridade}</div>
           </div>
           <div class="meta-item">
             <label>SLA</label>
             <div class="val">${at.sla.horasDecorridas}h / ${at.sla.prazo}h</div>
           </div>
        </div>
      </div>
    `;

    // Tabs
    const tabs = Utils.$$('.drawer-tab');
    const contents = Utils.$$('.drawer-tab-content');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = Utils.$(`#drawer-${tab.dataset.tab}`);
        if (target) target.classList.add('active');

        if (tab.dataset.tab === 'timeline') Timeline.load(at.id, 'timeline');
        if (tab.dataset.tab === 'tarefas') this._loadTarefas(at.id);
        if (tab.dataset.tab === 'detalhes') this._renderDetails(at);
        if (tab.dataset.tab === 'interacoes') this._loadInteracoes(at.id);
      };
    });

    // Default tab: timeline (for omnichannel focus) or detalhes (if in conversas view)
    const isConversasView = (typeof App !== 'undefined' && App.currentView === 'conversas');
    const timelineTab = Array.from(tabs).find(t => t.dataset.tab === 'timeline');
    if (timelineTab) timelineTab.style.display = isConversasView ? 'none' : 'flex';

    const defaultTabName = isConversasView ? 'detalhes' : 'timeline';
    const defaultTab = Array.from(tabs).find(t => t.dataset.tab === defaultTabName) || tabs[0];
    defaultTab.click();
  },

  _renderDetails(at) {
    const container = Utils.$('#drawer-detalhes');
    const slaStatus = Utils.slaStatus(at.sla);
    const slaPct = Utils.slaPct(at.sla);
    const avatarBg = Utils.avatarColor(at.responsavel.nome);

    container.innerHTML = `
      <div class="detail-section">
        <div class="detail-grid">
          <div class="detail-field">
            <label>Cliente</label>
            <div class="value">${Utils.escapeHtml(at.cliente.nome)}</div>
          </div>
          <div class="detail-field">
            <label>Canal</label>
            <div class="value"><span class="channel-badge ${Utils.channelClass(at.canal)}">${Utils.escapeHtml(at.canal)}</span></div>
          </div>
          <div class="detail-field">
            <label>Assunto</label>
            <div class="value">${Utils.escapeHtml(at.assunto.nome)}</div>
          </div>
          <div class="detail-field">
            <label>Prioridade</label>
            <div class="value" style="display:flex;align-items:center;gap:6px">
              <span class="priority-dot ${Utils.priorityClass(at.prioridade)}"></span>
              ${at.prioridade.charAt(0).toUpperCase() + at.prioridade.slice(1)}
            </div>
          </div>
          <div class="detail-field">
            <label>Situação</label>
            <div class="value">
              <span class="hig-badge" style="background:${at.situacao.cor}20;color:${at.situacao.cor}">${Utils.escapeHtml(at.situacao.nome)}</span>
            </div>
          </div>
          <div class="detail-field">
            <label>Responsável</label>
            <div class="value" style="display:flex;align-items:center;gap:8px">
              <span class="avatar avatar-sm" style="background:${avatarBg}">${Utils.getInitials(at.responsavel.nome)}</span>
              ${Utils.escapeHtml(at.responsavel.nome)}
            </div>
          </div>
          <div class="detail-field">
            <label>Time</label>
            <div class="value">${Utils.escapeHtml(at.time.nome)}</div>
          </div>
          <div class="detail-field">
            <label>Criado em</label>
            <div class="value">${Utils.formatDateTime(at.criadoEm)}</div>
          </div>
        </div>

        <div style="margin-top:var(--sp-lg)">
          <label class="hig-label">SLA</label>
          <div class="${slaStatus}" style="margin-top:4px">
            <div class="sla-bar"><div class="sla-bar-fill" style="width:${slaPct}%"></div></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px">
              <span style="font-size:11px;color:var(--text-tertiary)">${at.sla.horasDecorridas}h de ${at.sla.prazo}h</span>
              <span style="font-size:11px;color:var(--text-tertiary)">${Math.round(slaPct)}%</span>
            </div>
          </div>
        </div>

        ${at.descricao ? `
        <div style="margin-top:var(--sp-lg)">
          <label class="hig-label">Descrição</label>
          <p style="font-size:var(--fs-caption);color:var(--text-secondary);margin-top:4px;line-height:1.5">${Utils.escapeHtml(at.descricao)}</p>
        </div>` : ''}
      </div>
    `;
  },

  async _loadTarefas(atendimentoId) {
    const container = Utils.$('#drawer-tarefas');
    container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg)"><p>Carregando...</p></div>';

    try {
      const tarefas = await API.getTarefas(atendimentoId);
      if (!tarefas.length) {
        container.innerHTML = '<div class="empty-state"><h3>Nenhuma tarefa</h3><p style="font-size:var(--fs-micro)">Este atendimento não possui tarefas.</p></div>';
        return;
      }
      container.innerHTML = tarefas.map(t => `
        <div class="task-item">
          <div class="task-check ${t.status === 'concluida' ? 'done' : ''}" data-tarefa-id="${t.id}" data-at-id="${atendimentoId}"></div>
          <div class="task-info">
            <div class="task-desc ${t.status === 'concluida' ? 'done' : ''}">${Utils.escapeHtml(t.descricao)}</div>
            <div class="task-meta">${Utils.escapeHtml(t.responsavel)} · ${Utils.timeAgo(t.criadoEm)}</div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.task-check:not(.done)').forEach(el => {
        el.onclick = async () => {
          await API.encerrarTarefa(el.dataset.atId, el.dataset.tarefaId);
          el.classList.add('done');
          el.nextElementSibling.querySelector('.task-desc').classList.add('done');
        };
      });
    } catch { container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar tarefas</h3></div>'; }
  },

  async _loadInteracoes(atId) {
    const container = Utils.$('#drawer-interacoes');
    if (!container) return;
    container.innerHTML = '<div class="empty-state" style="padding:var(--sp-lg)"><p>Carregando logs...</p></div>';

    try {
      const logs = await API.getInteracoes(atId);
      if (!logs.length) {
        container.innerHTML = '<div class="empty-state"><h3>Sem logs</h3></div>';
        return;
      }
      container.innerHTML = `
        <div class="logs-list" style="padding: var(--sp-lg)">
          ${logs.map(log => `
            <div class="log-item" style="display:flex; gap: var(--sp-md); margin-bottom: var(--sp-md); font-size: var(--fs-caption)">
              <div class="log-time" style="color: var(--text-tertiary); white-space: nowrap">${Utils.formatTime(log.criadoEm)}</div>
              <div class="log-content">
                <div class="log-desc" style="color: var(--text-primary); font-weight: var(--fw-medium)">${Utils.escapeHtml(log.descricao)}</div>
                <div class="log-author" style="color: var(--text-secondary); font-size: 10px">por ${Utils.escapeHtml(log.autor)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch { container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar logs</h3></div>'; }
  },

  // ── New Atendimento Modal ──
  openNewAtendimento() {
    this.openModal(`
      <div class="modal-header">
        <h2>Novo Atendimento</h2>
        <button class="hig-btn-icon hig-btn-secondary" data-close>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="new-atendimento-form">
          <div class="form-group" style="margin-bottom:var(--sp-md)">
            <label class="hig-label">Título</label>
            <input class="hig-input" id="new-titulo" placeholder="Descreva o atendimento" required>
          </div>
          <div class="form-group" style="margin-bottom:var(--sp-md)">
            <label class="hig-label">Cliente</label>
            <input class="hig-input" id="new-cliente" placeholder="Nome do cliente">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-md);margin-bottom:var(--sp-md)">
            <div>
              <label class="hig-label">Canal</label>
              <select class="hig-input hig-select" id="new-canal">
                <option>Email</option><option>WhatsApp</option><option>Portal do Cliente</option>
                <option>Interno</option><option>Pós-venda</option><option>Blip</option>
              </select>
            </div>
            <div>
              <label class="hig-label">Prioridade</label>
              <select class="hig-input hig-select" id="new-prioridade">
                <option value="baixa">Baixa</option><option value="media" selected>Média</option>
                <option value="alta">Alta</option><option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:var(--sp-md)">
            <label class="hig-label">Descrição</label>
            <textarea class="hig-input hig-textarea" id="new-descricao" placeholder="Detalhes adicionais..."></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="hig-btn hig-btn-secondary" data-close>Cancelar</button>
        <button class="hig-btn hig-btn-primary" id="btn-criar-atendimento">Criar Atendimento</button>
      </div>
    `);

    Utils.$('#btn-criar-atendimento').onclick = async () => {
      const titulo = Utils.$('#new-titulo').value.trim();
      if (!titulo) return;
      try {
        await API.criarAtendimento({
          titulo,
          clienteNome: Utils.$('#new-cliente').value.trim(),
          canal: Utils.$('#new-canal').value,
          prioridade: Utils.$('#new-prioridade').value,
          descricao: Utils.$('#new-descricao').value.trim(),
        });
        this.closeModal();
        Kanban.refresh();
      } catch (err) { alert('Erro ao criar: ' + err.message); }
    };
  }
};
