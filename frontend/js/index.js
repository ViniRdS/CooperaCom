// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

async function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');

    projectsGrid.innerHTML = '<p>Carregando...</p>';

    try {
        let projects = await api.getProjects();
        
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
            return;
        }

        //PEGAR SOMENTE OS 3 ÚLTIMOS
        projects = projects.slice(-3).reverse();

        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const current = project.current_volunteer || 0;
            const max = project.number_volunteer || 1;
            const percent = Math.min((current / max) * 100, 100);

            const card = document.createElement('div');
            card.classList.add('project-card');

            card.innerHTML = `
                <h3 class="project-title">${project.title}</h3>

                <p class="project-description">
                    ${project.description}
                </p>

                <p class="project-category">
                    Categoria: <strong>${project.category_name}</strong>
                </p>

                <p class="project-creator">
                    Criador: <strong>${project.creator_name}</strong>
                </p>

                <div class="project-progress">
                    <div class="project-progress-filled" style="width: ${percent}%"></div>
                </div>

                <p class="project-slots">${current} / ${max} voluntários</p>

                <a href="project-detail.html?id=${project.id}" class="link-more">
                    Ver mais
                </a>
            `;

            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        projectsGrid.innerHTML = '<p>Erro ao carregar projetos.</p>';
    }
}
