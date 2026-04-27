/* ═══════════════════════════════════════════
   SKanban — Card Component
   ═══════════════════════════════════════════ */

const Card = {
  render(at) {
    const slaStatus = Utils.slaStatus(at.sla);
    const slaPct = Utils.slaPct(at.sla);
    const avatarBg = Utils.avatarColor(at.responsavel.nome);

    const card = document.createElement('div');
    card.className = `kanban-card priority-${at.prioridade} ${Utils.channelClass(at.canal)}`;
    card.draggable = true;
    card.dataset.id = at.id;
    card.dataset.situacaoId = at.situacao.id;

    card.innerHTML = `
      <div class="card-header">
        <span class="priority-dot ${Utils.priorityClass(at.prioridade)}" title="Prioridade: ${at.prioridade}"></span>
        <div class="card-title">${Utils.escapeHtml(at.cliente.nome)}</div>
        <span class="channel-icon ${Utils.channelClass(at.canal)}" title="${Utils.escapeHtml(at.canal)}">
          ${Utils.channelIcon(at.canal)}
        </span>
      </div>
      <div class="card-subtitle">${Utils.escapeHtml(at.assunto.nome)}</div>
      <div class="card-meta">
        <div class="card-meta-right" style="margin-left:0; width:100%; justify-content:flex-end">
          <span class="card-time">${Utils.timeAgo(at.atualizadoEm)}</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="sla-bar"><div class="sla-bar-fill" style="width:${slaPct}%"></div></div>
      </div>
    `;

    // Click to open detail drawer
    card.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      Modal.openDrawer(at);
    });

    // Drag events
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', at.id);
      // Ghost image with slight opacity
      const ghost = card.cloneNode(true);
      ghost.style.width = card.offsetWidth + 'px';
      ghost.style.opacity = '0.85';
      ghost.style.transform = 'rotate(2deg)';
      ghost.style.position = 'absolute';
      ghost.style.top = '-1000px';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 20, 20);
      setTimeout(() => document.body.removeChild(ghost), 0);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      Utils.$$('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    });

    return card;
  }
};
