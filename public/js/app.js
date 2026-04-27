/* ═══════════════════════════════════════════
   SKanban — App Controller (Router + Init)
   ═══════════════════════════════════════════ */

const App = {
  currentView: 'kanban',

  start() {
    if (Auth.isLoggedIn()) {
      Utils.$('#login-screen').style.display = 'none';
      this.init();
    } else {
      Auth.renderLoginScreen();
    }
  },

  async init() {
    this.renderSidebar();
    this.setupSearch();
    Filters.render();
    this.navigate('kanban');
  },

  showLogin() {
    Utils.$('#app-shell').style.display = 'none';
    Utils.$('#login-screen').style.display = 'flex';
    Auth.renderLoginScreen();
  },

  renderSidebar() {
    Utils.$('#app-shell').style.display = 'flex';
    const user = Auth.getUser();
    if (user) {
      const nameEl = Utils.$('#sidebar-user-name');
      const roleEl = Utils.$('#sidebar-user-role');
      const avatarEl = Utils.$('#sidebar-user-avatar');
      if (nameEl) nameEl.textContent = user.nome;
      if (roleEl) roleEl.textContent = user.perfil === 'gerente' ? 'Gerente' : 'Operador';
      if (avatarEl) {
        avatarEl.style.background = Utils.avatarColor(user.nome);
        avatarEl.textContent = Utils.getInitials(user.nome);
      }
    }

    // Nav links
    Utils.$$('.sidebar-link[data-view]').forEach(link => {
      link.onclick = () => this.navigate(link.dataset.view);
    });

    // New atendimento button
    const newBtn = Utils.$('#btn-new-atendimento');
    if (newBtn) newBtn.onclick = () => Modal.openNewAtendimento();

    // Logout
    const logoutBtn = Utils.$('#btn-logout');
    if (logoutBtn) logoutBtn.onclick = () => Auth.logout();
  },

  setupSearch() {
    const input = Utils.$('#search-input');
    if (!input) return;
    input.oninput = Utils.debounce(() => {
      if (this.currentView === 'kanban') Kanban.refresh();
    }, 400);
  },

  async navigate(view) {
    this.currentView = view;

    // Update nav active state
    Utils.$$('.sidebar-link').forEach(l => l.classList.remove('active'));
    const activeLink = Utils.$(`.sidebar-link[data-view="${view}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update top bar title
    const titles = { kanban: 'Kanban', dashboard: 'Dashboard' };
    const titleEl = Utils.$('#view-title');
    if (titleEl) titleEl.textContent = titles[view] || 'SKanban';

    // Show/hide views
    Utils.$$('.view-section').forEach(s => s.classList.remove('active'));

    if (view === 'kanban') {
      Utils.$('#view-kanban').classList.add('active');
      Utils.$('#filter-bar').style.display = 'flex';
      await Kanban.init();
    } else if (view === 'dashboard') {
      Utils.$('#view-dashboard').classList.add('active');
      Utils.$('#filter-bar').style.display = 'none';
      await Dashboard.render();
    }
  }
};

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => App.start());
