/* =====================================================
   PROFILE.JS — CARREGA PROJETOS CRIADOS E VOLUNTARIADOS
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadUserProjects();
});

async function loadUserProjects() {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        console.warn("Usuário não logado.");
        return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    if (!userId) {
        console.error("ERRO: user.id não encontrado no localStorage.");
        return;
    }

    renderProjectsSection(
        `/api/project/by-creator/${userId}`,
        "#created-projects",
        "Você ainda não criou nenhum projeto."
    );

    renderProjectsSection(
        `/api/project/by-volunteer/${userId}`,
        "#volunteer-projects",
        "Você ainda não participa de nenhum projeto."
    );
}

/* =====================================================
   CARREGA E RENDERIZA LISTAGEM DE PROJETOS EM CARDS
   ===================================================== */

async function renderProjectsSection(apiUrl, containerSelector, emptyMessage) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        const res = await fetch(apiUrl, { headers: { "Authorization": localStorage.getItem("token") } });
        if (!res.ok) {
            container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
            return;
        }

        const projects = await res.json();

        if (!projects || projects.length === 0) {
            container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
            return;
        }

        const cardTemplate = await loadProjectCardTemplate();

        container.innerHTML = projects.map(project =>
            buildProjectCard(cardTemplate, project)
        ).join("");

    } catch (err) {
        console.error(`Erro ao carregar ${containerSelector}:`, err);
        container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    }
}

/* =====================================================
   BUSCA TEMPLATE DE CARD (project-card.html)
   ===================================================== */

async function loadProjectCardTemplate() {
    const paths = [
        "components/project-card.html",
        "../components/project-card.html",
        "../../components/project-card.html"
    ];

    for (const p of paths) {
        try {
            const res = await fetch(p);
            if (!res.ok) continue;
            return await res.text();
        } catch (err) {}
    }

    throw new Error("Não foi possível carregar project-card.html");
}

/* =====================================================
   PREENCHE TEMPLATE COM OS DADOS DO PROJETO
   ===================================================== */

function buildProjectCard(template, project) {
    return template
        .replace("Título do Projeto", project.title)
        .replace("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae...", project.description || "Sem descrição.")
        .replace("Educação", project.category || "N/A")
        .replace("Nome do Usuário", project.creator?.name || "Desconhecido")
        .replace("3 / 5", `${project.currentVolunteers || 0} / ${project.requiredVolunteers || 0}`)
        .replace("project-detail.html?id=1", `project-detail.html?id=${project.id}`);
}
