/* ═══════════════════════════════════════════
   SKanban — Timeline (Chat-style Messages)
   ═══════════════════════════════════════════ */

const Timeline = {
  currentAtendimentoId: null,

  async load(atendimentoId) {
    this.currentAtendimentoId = atendimentoId;
    const container = Utils.$('#timeline-messages');
    container.innerHTML = '<div class="empty-state"><p style="animation:pulse 1.5s ease-in-out infinite">Carregando mensagens...</p></div>';

    try {
      const mensagens = await API.getMensagens(atendimentoId);
      this.render(mensagens);
      this._setupInput(atendimentoId);
    } catch {
      container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar mensagens</h3></div>';
    }
  },

  render(mensagens) {
    const container = Utils.$('#timeline-messages');
    if (!mensagens.length) {
      container.innerHTML = '<div class="empty-state"><h3>Sem mensagens</h3><p style="font-size:var(--fs-micro)">Nenhuma interação registrada.</p></div>';
      return;
    }

    container.innerHTML = mensagens.map((m, i) => {
      const tipo = m.remetente.tipo;
      const hasAttach = m.anexos && m.anexos.length > 0;
      return `
        <div class="timeline-msg ${tipo}" style="animation-delay:${i * 0.04}s">
          <div class="timeline-msg-header">
            <span class="timeline-msg-author">${Utils.escapeHtml(m.remetente.nome)}</span>
            <span class="timeline-msg-time">${Utils.formatTime(m.criadoEm)}</span>
          </div>
          <div class="timeline-msg-text">${Utils.escapeHtml(m.texto)}</div>
          ${hasAttach ? `<div class="timeline-msg-attachment">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            ${m.anexos.map(a => `<span>${Utils.escapeHtml(a.nome)}</span>`).join('')}
          </div>` : ''}
        </div>
      `;
    }).join('');

    // Scroll to bottom
    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
  },

  _setupInput(atendimentoId) {
    const textarea = Utils.$('#timeline-textarea');
    const sendBtn = Utils.$('#timeline-send-btn');
    if (!textarea || !sendBtn) return;

    textarea.value = '';
    textarea.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._send(atendimentoId); }
    };
    sendBtn.onclick = () => this._send(atendimentoId);
  },

  async _send(atendimentoId) {
    const textarea = Utils.$('#timeline-textarea');
    const texto = textarea.value.trim();
    if (!texto) return;

    textarea.value = '';
    textarea.style.height = 'auto';

    // Optimistic add
    const container = Utils.$('#timeline-messages');
    const msgEl = document.createElement('div');
    msgEl.className = 'timeline-msg operador';
    msgEl.innerHTML = `
      <div class="timeline-msg-header">
        <span class="timeline-msg-author">Você</span>
        <span class="timeline-msg-time">${Utils.formatTime(new Date().toISOString())}</span>
      </div>
      <div class="timeline-msg-text">${Utils.escapeHtml(texto)}</div>
    `;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    try {
      await API.enviarMensagem(atendimentoId, texto);
    } catch { msgEl.style.opacity = '0.5'; }
  }
};
