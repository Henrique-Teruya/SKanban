/* ═══════════════════════════════════════════
   SKanban — API Client
   ═══════════════════════════════════════════ */

const API = {
  baseURL: '',

  getToken() {
    return sessionStorage.getItem('skanban_token');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const config = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, config);
      if (res.status === 401) { Auth.logout(); return null; }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ erro: 'Erro desconhecido' }));
        throw new Error(err.erro || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[API] ${endpoint}:`, err.message);
      throw err;
    }
  },

  get(endpoint) { return this.request(endpoint); },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },

  // ── Endpoints ──
  login(usuario, senha) { return this.post('/api/auth/login', { usuario, senha }); },

  getSituacoes() { return this.get('/api/situacoes'); },
  getAtendimentos(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/api/atendimentos${qs ? '?' + qs : ''}`);
  },
  getAtendimento(id) { return this.get(`/api/atendimentos/${id}`); },
  criarAtendimento(data) { return this.post('/api/atendimentos', data); },
  atualizarAtendimento(id, data) { return this.patch(`/api/atendimentos/${id}`, data); },
  alterarSituacao(id, situacaoId) { return this.patch(`/api/atendimentos/${id}/situacao`, { situacaoId }); },
  finalizarAtendimento(id) { return this.post(`/api/atendimentos/${id}/finalizar`, {}); },

  getMensagens(id) { return this.get(`/api/atendimentos/${id}/mensagens`); },
  enviarMensagem(id, texto) { return this.post(`/api/atendimentos/${id}/mensagens`, { texto }); },

  getTarefas(id) { return this.get(`/api/atendimentos/${id}/tarefas`); },
  encerrarTarefa(atId, tarefaId) { return this.post(`/api/atendimentos/${atId}/tarefas/${tarefaId}/encerrar`, {}); },

  getAssuntos() { return this.get('/api/assuntos'); },
  getSubassuntos(assuntoId) { return this.get(`/api/assuntos/${assuntoId}/subassuntos`); },

  getTimes() { return this.get('/api/times'); },
  getIntegrantes(timeId) { return this.get(`/api/times/${timeId}/integrantes`); },

  getDashboardStats() { return this.get('/api/dashboard/stats'); },

  avaliar(id, nota) { return this.post(`/api/atendimentos/${id}/avaliar`, { nota }); },
};
