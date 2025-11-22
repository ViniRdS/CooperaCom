// projects.js
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects-grid');
    const searchInput = document.querySelector('#search');
    const categorySelect = document.querySelector('#category');
    const loadMoreBtn = document.querySelector('#load-more');

    let allProjects = [];
    let visibleCount = 6; // mostra 6 inicialmente

    // Carrega projetos da API (com filtros opcionais)
    async function loadProjects(filters = {}) {
        try {
            grid.innerHTML = '<p>Carregando...</p>';
            allProjects = await api.getProjects(filters) || [];
            // caso a API retorne um objeto {data: [...]}, tente ajustar aqui:
            if (!Array.isArray(allProjects) && allProjects.data) {
                allProjects = allProjects.data;
            }
            renderProjects();
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            grid.innerHTML = '<p>Ocorreu um erro ao carregar os projetos.</p>';
            loadMoreBtn.style.display = "none";
        }
    }

    // Gera o HTML de cada card de forma consistente com o CSS
    function createCardHTML(p) {
        // valores seguros
        const title = p.title || 'Sem título';
        const category = p.category_name || p.category || '—';
        const creator = p.creator_name || (p.creator && p.creator.name) || 'Usuário';
        const description = p.description || '';
        const current = Number(p.current_volunteer || p.current || 0);
        const max = Number(p.number_volunteer || p.number || 1);
        const percent = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;

        return `
            <h3 class="project-title">${escapeHtml(title)}</h3>

            <p class="project-description">${escapeHtml(description)}</p>

            <p class="project-category">Categoria: <strong>${escapeHtml(category)}</strong></p>

            <p class="project-creator">Criador: <strong>${escapeHtml(creator)}</strong></p>

            <div class="project-progress" aria-hidden="true">
                <div class="project-progress-filled" style="width: ${percent}%;"></div>
            </div>

            <p class="project-slots">${current} / ${max} voluntários</p>

            <a href="project-detail.html?id=${encodeURIComponent(p.id)}" class="link-more">Ver mais</a>
        `;
    }

    // Renderiza os projetos atuais (limita por visibleCount)
    function renderProjects() {
        grid.innerHTML = '';

        if (!allProjects || allProjects.length === 0) {
            grid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
            loadMoreBtn.style.display = "none";
            return;
        }

        const projectsToShow = allProjects.slice(0, visibleCount);

        projectsToShow.forEach(p => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.innerHTML = createCardHTML(p);
            grid.appendChild(card);
        });

        // mostra ou esconde botão
        if (visibleCount >= allProjects.length) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "block";
        }
    }

    // evento do botão "Ver mais projetos" -> mostra todos
    loadMoreBtn.addEventListener('click', () => {
        visibleCount = allProjects.length;
        renderProjects();
        // opcional: rolar até o botão para o primeiro dos novos cards
        // document.querySelector('.projects-grid').scrollIntoView({behavior: 'smooth'});
    });

    // filtros: quando mudar, resetar visibleCount para 6 e recarregar
    function applyFilters() {
        visibleCount = 6;
        const filters = {};
        if (searchInput && searchInput.value) filters.search = searchInput.value;
        if (categorySelect && categorySelect.value) filters.category = categorySelect.value;
        loadProjects(filters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // simples debounce para evitar chamadas em cada tecla (200ms)
            clearTimeout(searchInput._debounce);
            searchInput._debounce = setTimeout(applyFilters, 200);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', applyFilters);
    }

    // XSS-safe simples para inserir strings vindas da API
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // inicial
    loadProjects();
});
