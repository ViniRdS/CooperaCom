document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  setupCreateProjectButton();
});

// === Carrega Navbar ===
function loadNavbar() {
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('navbar');
      if (!container) return console.warn('Navbar container não encontrado.');
      container.innerHTML = html;
      setupNavbarLinks();
    })
    .catch(err => console.error('Erro ao carregar navbar:', err));
}

// === Atualiza links do navbar com base no login ===
async function setupNavbarLinks() {
  const navLinks = document.querySelector('.nav-links') || document.getElementById('nav-links');
  if (!navLinks) return;

  const token = localStorage.getItem('token');
  navLinks.innerHTML = '';

  if (!token) {
    navLinks.innerHTML = `
      <li><a href="projects.html">Proje2tos</a></li>
      <li><a href="about.html">Sobre</a></li>
      <li><a href="contact.html">Contato</a></li>
      <li><a href="login.html">Entrar</a></li>
      <li><a href="register.html">Cadastrar</a></li>
    `;
  } else {
    try {
      const user = await api.getUserProfile();
      const firstName = user.name.split(' ')[0];
      navLinks.innerHTML = `
        <li><a href="projects.html">Proje3tos</a></li>
        <li><a href="create-project.html">Criar</a></li>
        <li><a href="about.html">Sobre</a></li>
        <li><a href="contact.html">Contato</a></li>
        <li class="dropdown">
          <a href="#" class="dropbtn">
            <img src="${user.avatar || 'img/default-avatar.png'}" class="avatar">
            ${firstName} ▼
          </a>
          <ul class="dropdown-content">
            <li><a href="profile.html">Perfil</a></li>
            <li><a href="settings.html">Configurações</a></li>
            <li><a href="#" id="logout">Sair</a></li>
          </ul>
        </li>
      `;
      setupLogout();
    } catch {
      renderDefaultNavbar(navLinks);
    }
  }
}

function renderDefaultNavbar(navLinks) {
  navLinks.innerHTML = `
    <li><a href="projects.html">Projet4os</a></li>
    <li><a href="create-project.html">Criar</a></li>
    <li><a href="about.html">Sobre</a></li>
    <li><a href="contact.html">Contato</a></li>
    <li class="dropdown">
      <a href="#" class="dropbtn">
        <img src="img/default-avatar.png" class="avatar"> Usuário ▼
      </a>
      <ul class="dropdown-content">
        <li><a href="profile.html">Perfil</a></li>
        <li><a href="settings.html">Configurações</a></li>
        <li><a href="#" id="logout">Sair</a></li>
      </ul>
    </li>
  `;
  setupLogout();
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
}

// === Botão criar projeto ===
function setupCreateProjectButton() {
  const btn = document.getElementById('create-project-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
      window.location.href = 'create-project.html';
    } else {
      window.location.href = 'login.html';
    }
  });
}
