document.addEventListener("DOMContentLoaded", async () => {
    setupAvatarUpload();
    await loadProfileInfo();
    loadProjects();
});

async function loadProfileInfo() {
    try {
        const user = await api.getUserProfile();

        document.getElementById("user-name").textContent = user.name || "Sem nome";
        document.getElementById("user-bio").textContent = user.bio || "Nenhuma biografia adicionada.";
        
        if (user.avatar) {
            document.getElementById("user-avatar").src = user.avatar;
        }
    } catch (err) {
        console.error("Erro ao carregar perfil:", err);
    }
}
function setupAvatarUpload() {
    const avatar = document.getElementById("user-avatar");
    const input = document.getElementById("avatar-input");

    if (!avatar || !input) return;

}

async function loadProjects() {
    const user = await api.getUserProfile();

    const createdGrid = document.querySelector('#created-projects');
    const volunteerGrid = document.querySelector('#volunteer-projects');

    createdGrid.innerHTML = '<p>Carregando...</p>';
    volunteerGrid.innerHTML = '<p>Carregando...</p>';

    try {
        // PROJETOS CRIADOS
        let createdProjects = await api.getCreatedProjects(user.id);

        if (!createdProjects || createdProjects.length === 0) {
            createdGrid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        } else {
            createdProjects.sort((a, b) => b.id - a.id);
            document.getElementById("created-count").textContent = createdProjects.length;
            createdProjects = createdProjects.slice(0, 3);
            createdGrid.innerHTML = '';
            

            createdProjects.forEach(project => {
                createdGrid.appendChild(buildProjectCard(project));
            });
        }

        // PROJETOS QUE O USUÁRIO PARTICIPA
        let joinedProjects = await api.getJoinedProjects(user.id);

        if (!joinedProjects || joinedProjects.length === 0) {
            volunteerGrid.innerHTML = '<p>Você não participa de nenhum projeto.</p>';
        } else {
            joinedProjects.sort((a, b) => b.id - a.id);
            document.getElementById("vol-count").textContent = joinedProjects.length;
            joinedProjects = joinedProjects.slice(0, 3);
            volunteerGrid.innerHTML = '';

            joinedProjects.forEach(project => {
                volunteerGrid.appendChild(buildProjectCard(project));
            });
        }

    } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        createdGrid.innerHTML = '<p>Erro ao carregar projetos criados.</p>';
        volunteerGrid.innerHTML = '<p>Erro ao carregar projetos de voluntariado.</p>';
    }
}

function buildProjectCard(project) {
    const current = project.current_volunteer || 0;
    const max = project.number_volunteer || 1;
    const percent = Math.min((current / max) * 100, 100);

    const category = project.category_name || project.category || project.category?.name || "Sem categoria";
    const creator = project.creator_name || project.creator || project.creator?.name || "Desconhecido";

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

        <a href="project-detail.html?id=${project.id}" class="link-more">
            Ver mais
        </a>
    `;

    return card;
}

document.addEventListener("DOMContentLoaded", () => {
    const avatarImg = document.getElementById("user-avatar");
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.getElementById("modalClose"); // AGORA EXISTE

    if (!avatarImg) return;

    avatarImg.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = avatarImg.src;
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});