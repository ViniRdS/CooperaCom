// =============== COMPONENT LOADER UNIFICADO E OTIMIZADO ===============
function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return Promise.resolve(null);

    // Evita recarregar o mesmo componente
    if (el.dataset.componentLoaded === "true") {
        return Promise.resolve(el);
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(data => {
            // Proteção para evitar sobrescrever se outro script carregou antes
            if (el.dataset.componentLoaded === "true") return el;

            el.innerHTML = data;
            el.dataset.componentLoaded = "true";
            return el;
        })
        .catch(err => {
            console.error(`Erro ao carregar "${url}":`, err);
            return el;
        });
}



// =============== NAVBAR + BACKEND USER PROFILE ===============
async function setupNavbar() {
    const nav = document.querySelector("header");
    if (!nav) return;

    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    const token = localStorage.getItem("token");

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

    try {
        const user = await api.getUserProfile();
        const firstName = user.name.split(" ")[0];

        navLinks.innerHTML = `
            <li><a href="projects.html">Projetos</a></li>
            <li><a href="create-project.html">Criar</a></li>
            <li><a href="about.html">Sobre</a></li>
            <li><a href="contact.html">Contato</a></li>

            <li class="dropdown">
                <a href="#" class="dropbtn user-btn">
                    <img src="${user.avatar || 'img/default-avatar.png'}" class="avatar" />
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
        console.warn("Erro ao obter userProfile, carregando padrão.");
        navLinks.innerHTML = `
            <li><a href="projects.html">Projetos</a></li>
            <li><a href="about.html">Sobre</a></li>
            <li><a href="contact.html">Contato</a></li>
            <li><a href="login.html">Entrar</a></li>
        `;
    }
}



// =============== LOGOUT ===============
function setupLogout() {
    const logout = document.querySelector("#logout");
    if (!logout) return;

    logout.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}



// =============== PROJECT CARD PROGRESS ===============
function updateProjectCards() {
    document.querySelectorAll(".project-card").forEach(card => {
        const slotsText = card.querySelector(".project-slots span")?.innerText;
        if (!slotsText) return;

        const [current, max] = slotsText.split("/").map(n => parseInt(n.trim()));
        const bar = card.querySelector(".progress-bar");

        if (bar) bar.style.width = (current / max) * 100 + "%";
    });
}



// =============== DOM READY ===============
document.addEventListener("DOMContentLoaded", () => {

    // Carregar Navbar
    loadComponent("header", "components/navbar.html").then(() => {
        setupNavbar();
    });

    // Carregar Footer
    loadComponent("footer", "components/footer.html");

    // Carregar Project Cards + atualizar barras
    loadComponent("#project-card-container", "components/project-card.html")
        .then(() => updateProjectCards());
});
