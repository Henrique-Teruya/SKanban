/* ═══════════════════════════════════════════
   SKanban — Dashboard
   ═══════════════════════════════════════════ */

const Dashboard = {
  async render() {
    const container = Utils.$('#dashboard-content');
    container.innerHTML = '<div class="empty-state" style="padding:var(--sp-xxl)"><p style="animation:pulse 1.5s ease-in-out infinite">Carregando dashboard...</p></div>';

    try {
      const stats = await API.getDashboardStats();
      this._renderStats(container, stats);
    } catch {
      container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar dashboard</h3></div>';
    }
  },

  _renderStats(container, stats) {
    const situacaoEntries = Object.entries(stats.porSituacao);
    const canalEntries = Object.entries(stats.porCanal);
    const maxSit = Math.max(...situacaoEntries.map(([, v]) => v), 1);
    const maxCanal = Math.max(...canalEntries.map(([, v]) => v), 1);

    const barColors = { 'Novo': 'blue', 'Em Andamento': 'green', 'Aguardando Cliente': 'orange',
      'Aguardando Interno': 'purple', 'Resolvido': 'green', 'Finalizado': 'gray' };
    const canalColors = { 'Email': 'purple', 'WhatsApp': 'green', 'Portal do Cliente': 'blue',
      'Interno': 'gray', 'Pós-venda': 'orange', 'Blip': 'blue' };

    container.innerHTML = `
      <div class="dashboard-view">
        <div class="dashboard-header">
          <h2>Dashboard</h2>
          <p>Visão geral dos atendimentos</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card hig-glass stat-card-blue" style="animation-delay:0s">
            <div class="stat-card-label">Total Abertos</div>
            <div class="stat-card-value">${stats.abertos}</div>
            <div class="stat-card-detail">de ${stats.total} atendimentos</div>
          </div>
          <div class="stat-card hig-glass stat-card-green" style="animation-delay:0.06s">
            <div class="stat-card-label">Finalizados</div>
            <div class="stat-card-value">${stats.finalizados}</div>
            <div class="stat-card-detail">concluídos com sucesso</div>
          </div>
          <div class="stat-card hig-glass stat-card-orange" style="animation-delay:0.12s">
            <div class="stat-card-label">Tempo Médio</div>
            <div class="stat-card-value">${stats.tempoMedioResposta}h</div>
            <div class="stat-card-detail">tempo médio de resposta</div>
          </div>
          <div class="stat-card hig-glass stat-card-red" style="animation-delay:0.18s">
            <div class="stat-card-label">SLA Violados</div>
            <div class="stat-card-value">${stats.slaViolados}</div>
            <div class="stat-card-detail">fora do prazo</div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card hig-glass">
            <h3>Por Situação</h3>
            <div class="bar-chart">
              ${situacaoEntries.map(([nome, val]) => `
                <div class="bar-row">
                  <span class="bar-label">${nome}</span>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-${barColors[nome] || 'blue'}" style="width:${(val / maxSit) * 100}%">${val}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="chart-card hig-glass">
            <h3>Por Canal</h3>
            <div class="bar-chart">
              ${canalEntries.map(([nome, val]) => `
                <div class="bar-row">
                  <span class="bar-label">${nome}</span>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-${canalColors[nome] || 'blue'}" style="width:${(val / maxCanal) * 100}%">${val}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card hig-glass">
            <h3>Por Prioridade</h3>
            <div class="bar-chart">
              ${Object.entries(stats.porPrioridade).map(([nome, val]) => {
                const pColors = { baixa: 'gray', media: 'blue', alta: 'orange', urgente: 'bar-fill' };
                const label = nome.charAt(0).toUpperCase() + nome.slice(1);
                return `<div class="bar-row">
                  <span class="bar-label">${label}</span>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-${pColors[nome] || 'blue'}" style="width:${(val / Math.max(...Object.values(stats.porPrioridade), 1)) * 100}%">${val}</div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
