let currentPage = 1;
const perPage = 6;

document.addEventListener("DOMContentLoaded", () => {
    // Usuário precisa estar logado
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadProjects();

    document.getElementById("loadMoreBtn")
        .addEventListener("click", loadProjects);
});

function loadProjects() {
    api.getProjects({
        createdByUser: true,
        page: currentPage,
        limit: perPage
    })
    .then(response => {
        // Compatível com qualquer formato da sua API
        const projects = response.data || response.projects || response || [];

        const container = document.getElementById("my-projects-list");

        if (projects.length === 0 && currentPage === 1) {
            container.innerHTML = `
                <p class="text-center text-muted mt-4">
                    Você ainda não criou nenhum projeto.
                </p>
            `;
            document.getElementById("loadMoreBtn").style.display = "none";
            return;
        }

        projects.forEach(project => {
            container.innerHTML += createProjectCard(project);
        });

        if (projects.length < perPage) {
            document.getElementById("loadMoreBtn").style.display = "none";
        }

        currentPage++;
    })
    .catch(err => {
        console.error("Erro ao carregar projetos:", err);
    });
}

function createProjectCard(project) {
    const volunteers = project.volunteers?.length || 0;
    const limit = project.maxVolunteers || 50;
    const progress = Math.min((volunteers / limit) * 100, 100);

    return `
        <div class="col-md-6 col-lg-4">
            <div class="project-card">

                <h2 class="project-title">${project.title}</h2>

                <p class="project-meta">
                    ${project.category || "Sem categoria"} • Criado por você
                </p>

                <p class="project-description">
                    ${project.description.substring(0, 80)}...
                </p>

                <div class="progress">
                    <div class="progress-bar" style="width:${progress}%"></div>
                </div>

                <p class="mt-2" style="font-size:0.85rem;">
                    ${volunteers} / ${limit} voluntários
                </p>

                <div class="text-end mt-2">
                    <a class="view-more" href="project-details.html?id=${project.id}">
                        Ver Mais
                    </a>
                </div>

            </div>
        </div>
    `;
}
