/* ═══════════════════════════════════════════
   SKanban — Timeline (Chat-style Messages)
   ═══════════════════════════════════════════ */

const Timeline = {
  currentAtendimentoId: null,

  async load(atendimentoId, prefix = 'timeline') {
    this.currentAtendimentoId = atendimentoId;
    const msgContainer = Utils.$(`#${prefix}-messages`);
    if (!msgContainer) return;

    msgContainer.innerHTML = '<div class="empty-state" style="padding:var(--sp-xl)"><p style="animation:pulse 1.5s infinite">Carregando histórico...</p></div>';

    try {
      // Load both messages and interactions (system logs)
      const [mensagens, interacoes] = await Promise.all([
        API.getMensagens(atendimentoId),
        API.getInteracoes(atendimentoId)
      ]);

      this.render(mensagens, interacoes, prefix);
      this._setupInput(atendimentoId, prefix);
    } catch (err) {
      console.error(err);
      msgContainer.innerHTML = '<div class="empty-state"><h3>Erro ao carregar conversa</h3></div>';
    }
  },

  render(mensagens, interacoes, prefix) {
    const container = Utils.$(`#${prefix}-messages`);
    if (!container) return;

    // Merge and sort by date
    const allEvents = [
      ...mensagens.map(m => ({ ...m, eventType: 'message' })),
      ...interacoes.map(i => ({ ...i, eventType: 'system' }))
    ].sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));

    if (!allEvents.length) {
      container.innerHTML = '<div class="empty-state"><h3>Sem interações</h3><p>Nenhuma mensagem ou log registrado.</p></div>';
      return;
    }

    let lastDate = null;
    let html = '';

    allEvents.forEach((ev, i) => {
      const date = new Date(ev.criadoEm).toDateString();
      if (date !== lastDate) {
        html += `<div class="timeline-date-separator"><span>${Utils.formatDateSeparator(ev.criadoEm)}</span></div>`;
        lastDate = date;
      }

      if (ev.eventType === 'system') {
        html += `
          <div class="timeline-event-system">
            <span class="event-text">${Utils.escapeHtml(ev.descricao)}</span>
            <span class="event-time">${Utils.formatTime(ev.criadoEm)}</span>
          </div>
        `;
      } else {
        const tipo = ev.remetente.tipo; // cliente, operador, sistema, nota_interna
        const isSelf = tipo === 'operador';
        const isNote = ev.tipo === 'nota_interna';
        const hasAttach = ev.anexos && ev.anexos.length > 0;

        html += `
          <div class="timeline-bubble-wrapper ${tipo} ${isSelf ? 'self' : ''} ${isNote ? 'note' : ''}">
            <div class="bubble">
              ${!isSelf ? `<div class="bubble-author">${Utils.escapeHtml(ev.remetente.nome)}</div>` : ''}
              <div class="bubble-text">${Utils.escapeHtml(ev.texto)}</div>
              ${hasAttach ? `
                <div class="bubble-attachments">
                  ${ev.anexos.map(a => `
                    <div class="attachment-chip" title="${Utils.escapeHtml(a.nome)}">
                      ${Utils.fileIcon(a.nome)}
                      <span>${Utils.escapeHtml(a.nome)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              <div class="bubble-time">${Utils.formatTime(ev.criadoEm)}</div>
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
  },

  _setupInput(atendimentoId, prefix) {
    const textarea = Utils.$(`#${prefix}-textarea`);
    const sendBtn = Utils.$(`#${prefix}-send-btn`);
    if (!textarea || !sendBtn) return;

    textarea.value = '';
    textarea.oninput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    textarea.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._send(atendimentoId, prefix);
      }
    };

    sendBtn.onclick = () => this._send(atendimentoId, prefix);

    // Quick Actions
    const quickAction = Utils.$(`#${prefix}-quick-action`);
    if (quickAction) {
      quickAction.onchange = async () => {
        const val = quickAction.value;
        if (val === 'finalizar') {
          if (confirm('Deseja finalizar este atendimento?')) {
            await API.finalizarAtendimento(atendimentoId);
            this.load(atendimentoId, prefix);
            if (typeof Conversas !== 'undefined') Conversas.renderList();
          }
        } else if (val === 'status') {
          const sitId = prompt('Digite o ID da nova situação (1-Novo, 2-Em Andamento, 5-Resolvido):');
          if (sitId) {
            await API.alterarSituacao(atendimentoId, sitId);
            this.load(atendimentoId, prefix);
            if (typeof Conversas !== 'undefined') Conversas.renderList();
          }
        }
        quickAction.value = '';
      };
    }

    // File Upload
    const fileInput = Utils.$(`#${prefix}-file-upload`);
    if (fileInput) {
      fileInput.onchange = async () => {
        const files = fileInput.files;
        if (!files.length) return;
        
        for (let file of files) {
          const formData = new FormData();
          formData.append('arquivo', file);
          formData.append('nome', file.name);
          
          try {
            await API.uploadArquivo(atendimentoId, formData);
            // In a real app, we'd add the attachment to a pending message or send it immediately
            const msg = `Arquivo enviado: ${file.name}`;
            await API.enviarMensagem(atendimentoId, msg);
          } catch (err) {
            alert('Erro no upload: ' + err.message);
          }
        }
        this.load(atendimentoId, prefix);
      };
    }
  },

  async _send(atendimentoId, prefix) {
    const textarea = Utils.$(`#${prefix}-textarea`);
    const texto = textarea.value.trim();
    if (!texto) return;

    textarea.value = '';
    textarea.style.height = 'auto';

    // Optimistic UI add
    const container = Utils.$(`#${prefix}-messages`);
    const bubble = document.createElement('div');
    bubble.className = 'timeline-bubble-wrapper operador self';
    bubble.innerHTML = `
      <div class="bubble">
        <div class="bubble-text">${Utils.escapeHtml(texto)}</div>
        <div class="bubble-time">${Utils.formatTime(new Date().toISOString())}</div>
      </div>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

    try {
      await API.enviarMensagem(atendimentoId, texto);
      // Refresh list if in Conversas view
      if (typeof Conversas !== 'undefined' && Conversas.activeId === atendimentoId) {
        Conversas.renderList();
      }
    } catch {
      bubble.style.opacity = '0.5';
    }
  }
};
