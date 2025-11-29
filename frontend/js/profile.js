// Espera a navbar carregar completamente antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {
    const waitForNavbar = setInterval(() => {
        const nav = document.querySelector(".navbar");
        if (!nav) return;

        clearInterval(waitForNavbar);
        initProfile();
    }, 50);
});

async function initProfile() {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "login.html";

    try {
        // 👉 Busca o usuário logado DIRETAMENTE do backend
        const user = await api.getUserProfile();

        // Atualizar elementos
        document.getElementById("user-avatar").src =
            user.avatar || "img/default-avatar.png";

        document.getElementById("user-name").textContent =
            user.name || "Usuário";

        document.getElementById("user-bio").textContent =
            user.bio || "Sem descrição.";

        // Projetos criados
        const created = user.createdProjects || [];
        document.getElementById("created-count").textContent = created.length;

        document.getElementById("created-projects").innerHTML =
            created.length === 0
                ? `<p class="empty-msg">Você ainda não criou nenhum projeto.</p>`
                : created.slice(0, 3).map(p => createProjectCard(p)).join("");

        // Projetos voluntariados
        const volunteered = user.volunteeredProjects || [];
        document.getElementById("vol-count").textContent = volunteered.length;

        document.getElementById("volunteer-projects").innerHTML =
            volunteered.length === 0
                ? `<p class="empty-msg">Você ainda não participa de nenhum projeto.</p>`
                : volunteered.slice(0, 3).map(p => createProjectCard(p)).join("");

    } catch (err) {
        console.error("Erro carregando perfil:", err);
        window.location.href = "login.html";
    }
}
