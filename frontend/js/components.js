/* =====================================================
   components.js (robusto) - substitua seu arquivo atual
   ===================================================== */

/* -------------------------
   Função: tenta várias URLs
   ------------------------- */
async function tryFetchFallback(paths) {
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (!res.ok) continue;
      const text = await res.text();
      return { html: text, usedPath: p };
    } catch (err) {
      // tenta próxima opção
    }
  }
  // nada funcionou
  throw new Error("Nenhum caminho conseguiu carregar o componente.");
}

/* -------------------------
   Carrega componente no seletor
   - tenta vários caminhos relativos para suportar subpastas
   ------------------------- */
function loadComponent(selector, relativePath = "components/navbar.html") {
  const el = document.querySelector(selector);
  if (!el) return Promise.resolve(null);

  // caminhos para tentar: raiz, uma pasta acima, duas pastas acima
  const candidates = [
    relativePath,
    "../" + relativePath,
    "../../" + relativePath,
    "../../../" + relativePath
  ];

  return tryFetchFallback(candidates)
    .then(({ html, usedPath }) => {
      el.innerHTML = html;
      // opcional: armazenar qual caminho funcionou (útil para debug)
      el.dataset.componentPath = usedPath;
      return el;
    })
    .catch(err => {
      console.error(`loadComponent falhou para ${selector}:`, err);
      return null;
    });
}

/* -------------------------
   Normaliza retorno do endpoint de usuário
   ------------------------- */
async function fetchUserProfileFromApi(userId, token) {
  try {
    // tenta caminhos relativos a partir do documento atual também
    const candidates = [
      `${api.baseUrl}/users/${userId}`,
      `${api.baseUrl.replace(/\/$/, "")}/users/${userId}`
    ];

    for (const url of candidates) {
      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) continue;
        const data = await res.json();
        return data.user || data;
      } catch (err) {
        // tentar próximo
      }
    }
    return null;
  } catch (err) {
    console.error("Erro fetchUserProfileFromApi:", err);
    return null;
  }
}

/* -------------------------
   setupNavbar - atualiza avatar e nome
   ------------------------- */
async function setupNavbar() {
  // Seletores possíveis
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return; // nada a fazer

  // tenta pegar user do localStorage (login salva 'user')
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Se não houver token/usuário local, nada para exibir dinamicamente
  if (!token || !storedUser) {
    // opcional: esconder dropdown se existir
    const dd = document.querySelector(".dropdown");
    if (dd) dd.style.display = ""; // mantém markup do HTML (padrão)
    return;
  }

  let userLocal;
  try {
    userLocal = JSON.parse(storedUser);
  } catch (err) {
    console.warn("user em localStorage inválido:", err);
    return;
  }

  // Busca perfil real no backend (tratando formatos { user: ... } ou {...})
  let userFromApi = null;
  try {
    // Se você já tiver uma função api.getUserProfile no seu api.js que faz isso bem,
    // você pode preferi-la. Aqui usamos fetchUserProfileFromApi para garantir normalização.
    userFromApi = await fetchUserProfileFromApi(userLocal.id, token);
  } catch (err) {
    console.warn("Erro ao buscar perfil (fetchUserProfileFromApi):", err);
  }

  const user = userFromApi || userLocal || null;
  if (!user) return;

  // Atualiza avatar e nome — verifica existência dos elementos
  try {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
      const avatarEl = dropdown.querySelector(".avatar");
      const usernameEl = dropdown.querySelector(".username");

      if (avatarEl) avatarEl.src = (user.avatar && user.avatar.trim()) ? user.avatar : "img/default-avatar.png";
      if (usernameEl) usernameEl.textContent = (user.name ? user.name.split(" ")[0] : "Usuário");
    }
  } catch (err) {
    console.warn("Erro ao atualizar avatar/nome:", err);
  }

  // configurar logout (se houver)
  setupLogout();
}

/* -------------------------
   setupLogout
   ------------------------- */
function setupLogout() {
  const logoutBtn = document.getElementById("logout");
  if (!logoutBtn) return;
  // remove handlers antigos, previne multiplos binds
  logoutBtn.replaceWith(logoutBtn.cloneNode(true));
  const newBtn = document.getElementById("logout");
  if (!newBtn) return;
  newBtn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

/* -------------------------
   setupDropdown (global, seguro)
   - inicializa todos dropdowns no DOM
   ------------------------- */
function setupDropdown() {
  // global handler para fechar ao clicar fora (instala apenas uma vez)
  if (!window.__dropdownGlobalInstalled) {
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));
    });
    window.__dropdownGlobalInstalled = true;
  }

  document.querySelectorAll(".dropdown").forEach(drop => {
    const btn = drop.querySelector(".user-btn") || drop.querySelector(".dropbtn");
    if (!btn) return;

    // remove handler anterior (se existir)
    if (btn.__handler) {
      btn.removeEventListener("click", btn.__handler);
    }

    const handler = (e) => {
      e.stopPropagation();
      drop.classList.toggle("open");
    };
    btn.__handler = handler;
    btn.addEventListener("click", handler);
  });
}

/* -------------------------
   Inicialização robusta
   - detecta se existe #navbar ou header
   - tenta carregar navbar e footer com caminhos relativos
   ------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // preferir #navbar, senão header
  const selector = document.querySelector("#navbar") ? "#navbar" : (document.querySelector("header") ? "header" : null);

  if (!selector) {
    console.warn("Nenhum container de header encontrado (header ou #navbar). Navbar não será carregada.");
    return;
  }

  // Carrega o componente (tenta caminhos relativos)
  const loaded = await loadComponent(selector, "components/navbar.html");

  if (loaded) {
    // Inicializa funcionalidades dependentes do conteúdo da navbar
    try {
      setupDropdown();
      await setupNavbar();
    } catch (err) {
      console.warn("Erro ao inicializar navbar:", err);
    }
  } else {
    console.warn("Navbar não foi carregada (loadComponent retornou null).");
  }

  // footer (também tenta caminhos relativos)
  loadComponent("footer", "components/footer.html").catch(() => { /* ignore */ });
});
