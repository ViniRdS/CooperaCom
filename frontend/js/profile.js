/*document.addEventListener('DOMContentLoaded', () => {

    // 🔒 Exigir login
    const token = localStorage.getItem("token"); // corrigido
    if (!token) return window.location.href = "login.html";

    // Pega elementos do DOM
    const avatar = document.getElementById('user-avatar');
    const nameEl = document.getElementById('user-name');
    const bioEl = document.getElementById('user-bio');

    const createdCount = document.getElementById('created-count');
    const createdList = document.getElementById('created-projects');

    const volCount = document.getElementById('vol-count');
    const volList = document.getElementById('volunteer-projects');

    // Pega usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {
        name: "Usuário de Teste",
        bio: "Bio de teste.",
        avatar: "img/default-avatar.png",
        createdProjects: [],
        volunteeredProjects: []
    };

    // ---------------------------------------
    // 🔹 Dados do usuário
    // ---------------------------------------
    avatar.src = user.avatar;
    nameEl.textContent = user.name;
    bioEl.textContent = user.bio;

    // ---------------------------------------
    // 🔹 Projetos criados
    // ---------------------------------------
    const created = user.createdProjects || [];
    createdCount.textContent = created.length;
    createdList.innerHTML = created.length === 0
        ? `<p class="empty-msg">Você ainda não criou nenhum projeto.</p>`
        : created.slice(0, 3).map(p => createProjectCard(p)).join("");

    // ---------------------------------------
    // 🔹 Voluntariado
    // ---------------------------------------
    const volunteered = user.volunteeredProjects || [];
    volCount.textContent = volunteered.length;
    volList.innerHTML = volunteered.length === 0
        ? `<p class="empty-msg">Você ainda não participa de nenhum projeto.</p>`
        : volunteered.slice(0, 3).map(p => createProjectCard(p)).join("");
});

// ------------------------------------------------------
// 🔹 Função para gerar um card de projeto
// ------------------------------------------------------
function createProjectCard(project) {
    return `
        <div class="project-card">
            <h4>${project.title}</h4>
            <p>Categoria: ${project.category || "Não informada"}</p>
            <a href="project-details.html?id=${project.id}" class="btn btn-primary">
                Ver detalhes
            </a>
        </div>
    `;
};*/
