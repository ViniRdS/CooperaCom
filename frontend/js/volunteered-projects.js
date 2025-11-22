document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('volunteered-projects-grid');

    try {
        const profile = await api.getUserProfile();
        const projects = profile.volunteeredProjects;

        if (projects.length === 0) {
            grid.innerHTML = '<p>Você ainda não participa de nenhum projeto.</p>';
            return;
        }

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.innerHTML = `
                <h3>${proj.title}</h3>
                <p>Categoria: ${proj.category}</p>
                <p>Vagas: ${proj.volunteers}</p>
                <div class="card-buttons">
                    <a href="project-detail.html?id=${proj.id}" class="btn btn-primary">Ver detalhes</a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar seus projetos voluntariados. Tente novamente.');
    }
});
