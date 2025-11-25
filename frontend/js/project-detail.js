document.addEventListener("DOMContentLoaded", loadProjectDetail);

async function loadProjectDetail() {
    const id = getProjectIdFromURL();
    if (!id) return alert("Projeto não encontrado.");

    try {
        const response = await api.getProjectById(id);
        const project = response.data || response.project || response;

        // --- TÍTULO E DESCRIÇÃO ---
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-description").textContent = project.description;

        // --- LINHA HORIZONTAL: categoria • criador • data ---
        document.getElementById("project-creator").textContent =
            project.creator_name || "Não informado";

        document.getElementById("project-category").textContent =
            project.category_name || "Não informado";

        document.getElementById("project-date").textContent =
            new Date(project.createdAt).toLocaleDateString("pt-BR");

        // --- BARRA DE VOLUNTÁRIOS (DINÂMICA) ---
        atualizarBarra(project.current_volunteer, project.number_volunteer);

        // --- AVISOS ---
        const noticeText = document.getElementById("notice-text");
        if (project.notice_board?.trim()) {
            noticeText.innerHTML = project.notice_board.replace(/\n/g, "<br>");
        } else {
            noticeText.textContent = "Avisos ficarão aqui";
        }

        // --- BOTÃO PARTICIPAR / SAIR ---
        initJoinButton(project, id);

        // --- CHAT ---
        initChat(id);

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar projeto.");
    }
}

function getProjectIdFromURL() {
    return new URLSearchParams(window.location.search).get("id");
}

/* ---------------------- BARRA DE PROGRESSO ---------------------- */

function atualizarBarra(voluntariosAtuais, voluntariosTotais) {
    const porcentagem = (voluntariosAtuais / voluntariosTotais) * 100;

    const fill = document.querySelector(".progress-fill");
    const label = document.querySelector(".progress-label");

    if (fill) fill.style.width = `${porcentagem}%`;

    if (label)
        label.textContent = `${voluntariosAtuais} / ${voluntariosTotais} voluntários`;
}

/* ---------------------- BOTÃO PARTICIPAR / SAIR ---------------------- */

async function initJoinButton(project, id) {
    const btn = document.getElementById("join-leave-btn");
    const token = localStorage.getItem("token");

    if (!token) {
        btn.textContent = "Faça login para participar";
        btn.disabled = true;
        return;
    }

    function atualizarTudo() {
        atualizarBarra(project.current_volunteer, project.number_volunteer);
    }

    if (project.isJoined) {
        btn.textContent = "Sair do Projeto";
        btn.onclick = async () => {
            const res = await api.leaveProject(id);
            if (res.success) {
                project.current_volunteer--;
                atualizarTudo();
                btn.textContent = "Participar do Projeto";
                project.isJoined = false;
            }
        };
    } else {
        btn.textContent = "Participar do Projeto";
        btn.onclick = async () => {
            const res = await api.joinProject(id);
            if (res.success) {
                project.current_volunteer++;
                atualizarTudo();
                btn.textContent = "Sair do Projeto";
                project.isJoined = true;
            }
        };
    }
}
