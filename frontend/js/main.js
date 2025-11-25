// === Carrega Navbar ===
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  setupCreateProjectButton();
});

// === Carrega o arquivo HTML da navbar ===
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

// === Atualiza links da navbar baseado no login ===
async function setupNavbarLinks() {
  const navLinks = document.querySelector('.nav-links') || document.getElementById('nav-links');
  if (!navLinks) return;
  
  navLinks.innerHTML = '';

  const token = localStorage.getItem('token');

  // Se não estiver logado
  if (!token) {
    navLinks.innerHTML = `
      <li><a href="projects.html">Projetos</a></li>
      <li><a href="about.html">Sobre</a></li>
      <li><a href="contact.html">Contato</a></li>
      <li><a href="login.html">Entrar</a></li>
      <li><a href="register.html">Cadastrar</a></li>
    `;
    return;
  }

  // Se estiver logado
  try {
    const user = await api.getUserProfile();
    const firstName = user.name.split(' ')[0];

    navLinks.innerHTML = `
      <li><a href="projects.html">Projetos</a></li>
      <li><a href="create-project.html">Criar</a></li>
      <li><a href="about.html">Sobre</a></li>
      <li><a href="contact.html">Contato</a></li>

      <li class="dropdown">
        <a href="#" class="dropbtn user-btn">
          <img src="${user.avatar || 'img/default-avatar.png'}" 
               class="avatar fixed" 
               alt="Avatar do usuário">
          <span class="username">${firstName}</span> ▼
        </a>

        <ul class="dropdown-content">
          <li><a href="profile.html">Perfil</a></li>
          <li><a href="settings.html">Configurações</a></li>
          <li><a href="#" id="logout">Sair</a></li>
        </ul>
      </li>
    `;

    setupLogout();
  } catch (err) {
    console.warn("Erro ao obter usuário, carregando navbar padrão.");
    renderDefaultNavbar(navLinks);
  }
}

// === Navbar padrão caso o backend falhe ===
function renderDefaultNavbar(navLinks) {
  navLinks.innerHTML = `
    <li><a href="projects.html">Projetos</a></li>
    <li><a href="create-project.html">Criar</a></li>
    <li><a href="about.html">Sobre</a></li>
    <li><a href="contact.html">Contato</a></li>

    <li class="dropdown">
      <a href="#" class="dropbtn">
        <img src="img/default-avatar.png" class="avatar fixed" alt="Avatar padrão">
        Usuário ▼
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

// === Logout ===
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

// === Botão "Criar Projeto" global ===
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
