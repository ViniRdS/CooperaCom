document.addEventListener("DOMContentLoaded", async () => {
    loadProjects();
});

async function loadProjects() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        const projects = await api.getCreatedProjects(userId);

        const container = document.getElementById("my-projects-list");
        container.innerHTML = "";

        if (!Array.isArray(projects) || projects.length === 0) {
            container.innerHTML = `
                <p class="text-center text-muted mt-4">
                    Você ainda não criou nenhum projeto.
                </p>
            `;
            return;
        }

        projects.sort((a, b) => b.id - a.id);

        projects.forEach(project => {
            const wrapper = document.createElement("div");
            wrapper.className = "col-md-6 col-lg-4";
            wrapper.appendChild(buildProjectCard(project));
            container.appendChild(wrapper);
        });

    } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        showError("Erro ao carregar seus projetos.");
    }
}


function buildProjectCard(project) {
    const current = project.current_volunteer || 0;
    const max = project.number_volunteer || 1;
    const percent = Math.min((current / max) * 100, 100);

    const category = project.category_name || project.category || "Sem categoria";
    const creator = project.creator_name || "Você";

    const card = document.createElement('div');
    card.classList.add('project-card');

    card.innerHTML = `
        <h3 class="project-title">${project.title}</h3>

        <p class="project-description">
            ${project.description.substring(0, 33)}...
        </p>

        <p class="project-category">
            Categoria: <strong>${category}</strong>
        </p>

        <p class="project-creator">
            Criador: <strong>${creator}</strong>
        </p>

        <div class="project-progress">
            <div class="project-progress-filled" style="width: ${percent}%"></div>
        </div>

        <p class="project-slots">${current} / ${max} voluntários</p>

        <a href="project-detail.html?id=${project.id}" class="link-more">Ver mais</a>
    `;

    return card;
}

function showError(msg) {
    const container = document.getElementById("my-projects-list");
    container.innerHTML = `
        <div class="alert alert-danger text-center w-100">
            ${msg}
        </div>
    `;
}
