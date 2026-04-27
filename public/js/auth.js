/* ═══════════════════════════════════════════
   SKanban — Authentication
   ═══════════════════════════════════════════ */

const Auth = {
  currentUser: null,

  isLoggedIn() {
    return !!sessionStorage.getItem('skanban_token');
  },

  getUser() {
    if (this.currentUser) return this.currentUser;
    const raw = sessionStorage.getItem('skanban_user');
    if (raw) this.currentUser = JSON.parse(raw);
    return this.currentUser;
  },

  async login(usuario, senha) {
    const data = await API.login(usuario, senha);
    if (data && data.token) {
      sessionStorage.setItem('skanban_token', data.token);
      sessionStorage.setItem('skanban_user', JSON.stringify(data.usuario));
      this.currentUser = data.usuario;
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('skanban_token');
    sessionStorage.removeItem('skanban_user');
    this.currentUser = null;
    App.showLogin();
  },

  renderLoginScreen() {
    const screen = Utils.$('#login-screen');
    screen.style.display = 'flex';

    const form = Utils.$('#login-form');
    const errorEl = Utils.$('#login-error');

    form.onsubmit = async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';
      const usuario = Utils.$('#login-usuario').value.trim();
      const senha = Utils.$('#login-senha').value.trim();

      if (!usuario || !senha) {
        errorEl.textContent = 'Preencha usuário e senha';
        errorEl.style.display = 'block';
        return;
      }

      const btn = Utils.$('#login-btn');
      btn.textContent = 'Entrando...';
      btn.disabled = true;

      try {
        const ok = await this.login(usuario, senha);
        if (ok) {
          screen.style.display = 'none';
          App.init();
        } else {
          errorEl.textContent = 'Credenciais inválidas';
          errorEl.style.display = 'block';
        }
      } catch (err) {
        errorEl.textContent = 'Erro ao conectar';
        errorEl.style.display = 'block';
      } finally {
        btn.textContent = 'Entrar';
        btn.disabled = false;
      }
    };
  }
};
