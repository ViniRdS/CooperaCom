document.addEventListener("DOMContentLoaded", loadProjectDetail);

async function loadProjectDetail() {
    const id = getProjectIdFromURL();

    if (!id) {
        alert("Projeto não encontrado.");
        return;
    }

    try {
        const response = await api.getProjectById(id);
        const project = response.data || response.project || response;

        // ---------------------------------------
        // 🔹 Preencher dados do projeto
        // ---------------------------------------
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-creator").textContent = project.creator_name || "Não informado";
        document.getElementById("project-category").textContent = project.category_name || "Não informado";
        document.getElementById("project-slots").textContent = `${project.current_volunteer} / ${project.number_volunteer}`;
        document.getElementById("project-description").textContent = project.description;
        document.getElementById("project-date").textContent =
            new Date(project.createdAt).toLocaleDateString("pt-BR");

        // ---------------------------------------
        // 🔹 Avisos do projeto
        // ---------------------------------------
        const noticeContainer = document.getElementById("project-notices");
        const noticeText = document.getElementById("notice-text");

        if (project.notice_board && project.notice_board.trim() !== "") {
            noticeText.innerHTML = project.notice_board.replace(/\n/g, "<br>");
            noticeContainer.style.display = "block";
        } else {
            noticeText.textContent = "Avisos ficarão aqui";
        }

        // ---------------------------------------
        // 🔹 Botão de participação
        // ---------------------------------------
        const btn = document.getElementById("join-leave-btn");
        const token = localStorage.getItem("token");

        if (!token) {
            btn.textContent = "Faça login para participar";
            btn.disabled = true;
            return;
        }

        if (project.isJoined) {
            btn.textContent = "Sair do Projeto";
            btn.onclick = async () => {
                const res = await api.leaveProject(id);
                if (res.success) {
                    btn.textContent = "Participar do Projeto";
                }
            };
        } else {
            btn.textContent = "Participar do Projeto";
            btn.onclick = async () => {
                const res = await api.joinProject(id);
                if (res.success) {
                    btn.textContent = "Sair do Projeto";
                }
            };
        }

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar projeto.");
    }
}

function getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}
