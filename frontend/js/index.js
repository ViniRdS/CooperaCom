// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

async function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');

    // Limpa o conteúdo atual
    projectsGrid.innerHTML = '';

    try {
        // Chama a API
        const projects = await api.getProjects();

        // Se não houver projetos
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
            return;
        }

        // Cria cards dinamicamente
        projects.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('project-card');

            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.category} • Criado por <strong>${project.creator}</strong></p>
                <p>${project.description}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${project.progress}%"></div>
                </div>
                <small>${project.joinedVolunteers} / ${project.totalVolunteers} voluntários</small>
                <a href="project-detail.html?id=${project.id}">Ver mais</a>
            `;

            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        projectsGrid.innerHTML = '<p>Erro ao carregar projetos. Tente novamente mais tarde.</p>';
    }
}
