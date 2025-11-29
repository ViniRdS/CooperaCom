/* =====================================================
   components.js (versão corrigida e simplificada)
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
    } catch (err) {}
  }
  throw new Error("Nenhum caminho conseguiu carregar o componente.");
}

/* -------------------------
   Carrega componente no seletor
   ------------------------- */
function loadComponent(selector, relativePath = "components/navbar.html") {
  const el = document.querySelector(selector);
  if (!el) return Promise.resolve(null);

  const candidates = [
    relativePath,
    "../" + relativePath,
    "../../" + relativePath,
    "../../../" + relativePath
  ];

  return tryFetchFallback(candidates)
    .then(({ html, usedPath }) => {
      el.innerHTML = html;
      el.dataset.componentPath = usedPath;
      return el;
    })
    .catch(err => {
      console.error(`loadComponent falhou para ${selector}:`, err);
      return null;
    });
}

/* -------------------------
   setupNavbar – agora usando SOMENTE localStorage
   ------------------------- */
async function setupNavbar() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) return;

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (err) {
    console.warn("Erro ao ler user no localStorage:", err);
    return;
  }

  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    const avatarEl = dropdown.querySelector(".avatar");
    const usernameEl = dropdown.querySelector(".username");

    if (avatarEl) {
      avatarEl.src = user.avatar || "img/default-avatar.png";
    }

    if (usernameEl) {
      usernameEl.textContent = user.name || "Usuário";
    }
  }

  setupLogout();
}

/* -------------------------
   setupLogout
   ------------------------- */
function setupLogout() {
  const logoutBtn = document.getElementById("logout");
  if (!logoutBtn) return;

  logoutBtn.replaceWith(logoutBtn.cloneNode(true));
  const newBtn = document.getElementById("logout");

  newBtn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

/* -------------------------
   setupDropdown
   ------------------------- */
function setupDropdown() {
  if (!window.__dropdownGlobalInstalled) {
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown.open")
        .forEach(d => d.classList.remove("open"));
    });
    window.__dropdownGlobalInstalled = true;
  }

  document.querySelectorAll(".dropdown").forEach(drop => {
    const btn = drop.querySelector(".user-btn") || drop.querySelector(".dropbtn");
    if (!btn) return;

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
   Inicialização
   ------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const selector = document.querySelector("#navbar") ? "#navbar"
                  : document.querySelector("header") ? "header"
                  : null;

  if (!selector) {
    console.warn("Nenhum container de header encontrado.");
    return;
  }

  const loaded = await loadComponent(selector, "components/navbar.html");

  if (loaded) {
    setupDropdown();
    setupNavbar();
  }

  loadComponent("footer", "components/footer.html");
});
