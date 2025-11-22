// Espera a navbar carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    const waitForNavbar = setInterval(() => {
        // Verifica se o menu já foi injetado pela navbar.html
        const nav = document.querySelector(".navbar");
        if (!nav) return; // navbar ainda não carregou

        clearInterval(waitForNavbar);
        initProfile(); // agora pode rodar o profile
    }, 50);
});

async function initProfile() {

    // Exigir login
    const token = localStorage.getItem("token"); 
    if (!token) return window.location.href = "login.html";

    // ---------- resto do seu código ----------

    const avatar = document.getElementById('user-avatar');
    const nameEl = document.getElementById('user-name');
    const bioEl = document.getElementById('user-bio');

    const createdCount = document.getElementById('created-count');
    const createdList = document.getElementById('created-projects');

    const volCount = document.getElementById('vol-count');
    const volList = document.getElementById('volunteer-projects');

    const user = await api.getUserProfile();

    avatar.src = user.avatar;
    nameEl.textContent = user.name;
    bioEl.textContent = user.bio;

    const created = user.createdProjects || [];
    createdCount.textContent = created.length;
    createdList.innerHTML = created.length === 0
        ? `<p class="empty-msg">Você ainda não criou nenhum projeto.</p>`
        : created.slice(0, 3).map(p => createProjectCard(p)).join("");

    const volunteered = user.volunteeredProjects || [];
    volCount.textContent = volunteered.length;
    volList.innerHTML = volunteered.length === 0
        ? `<p class="empty-msg">Você ainda não participa de nenhum projeto.</p>`
        : volunteered.slice(0, 3).map(p => createProjectCard(p)).join("");
}
