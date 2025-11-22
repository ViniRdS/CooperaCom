// projects.js
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.projects-grid');
    const searchInput = document.querySelector('#search');
    const categorySelect = document.querySelector('#category');

    async function loadProjects(filters = {}) {
        try {
            const projects = await api.getProjects(filters);
            grid.innerHTML = '';

            if (!projects || projects.length === 0) {
                grid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
                return;
            }

            projects.forEach(p => {
                const card = document.createElement('div');
                card.classList.add('project-card');
                card.innerHTML = `
                    <h3>${p.title}</h3>
                    <p>${p.category} • Criado por <strong>${p.creator}</strong></p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${p.volunteersPercent}%;"></div>
                    </div>
                    <small>${p.currentVolunteers} / ${p.totalVolunteers} voluntários</small>
                    <a href="project-detail.html?id=${p.id}">Ver mais</a>
                `;
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            grid.innerHTML = '<p>Ocorreu um erro ao carregar os projetos.</p>';
        }
    }

    // Filtros
    searchInput.addEventListener('input', () => {
        loadProjects({ search: searchInput.value, category: categorySelect.value });
    });

    categorySelect.addEventListener('change', () => {
        loadProjects({ search: searchInput.value, category: categorySelect.value });
    });

    // Carrega projetos na inicialização
    loadProjects();
});
