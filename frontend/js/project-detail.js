document.addEventListener("DOMContentLoaded", loadProjectDetail);

async function loadProjectDetail() {

    const id = getProjectIdFromURL();
    if (!id) return alert("Projeto não encontrado.");

    try {
        const project = await api.getProjectById(id);

        if (!project || project.error) {
            return alert("Erro ao carregar projeto.");
        }

        // Mostrar botão de editar SE for o criador do projeto
        const user = JSON.parse(localStorage.getItem("user"));
        const editBtn = document.getElementById("edit-notice-btn");

        if (user && user.id === project.user_id) {
            editBtn.style.display = "inline-block";
        }

        // Preenche dados na tela
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-description").textContent = project.description;
        document.getElementById("project-creator").textContent = project.creator_name || "Não informado";
        document.getElementById("project-category").textContent = project.category_name || "Não informado";

        document.getElementById("project-date").textContent =
            project.createdAt
                ? new Date(project.createdAt).toLocaleDateString("pt-BR")
                : "";

        atualizarBarra(project.current_volunteer, project.number_volunteer);

        const noticeBox = document.getElementById("notice-text");
        if (project.notice_board?.trim()) {
            noticeBox.innerHTML = project.notice_board.replace(/\n/g, "<br>");
        } else {
            noticeBox.textContent = "Avisos ficarão aqui";
        }

        initJoinButton(project, id);
        initChat(id, project);
        initNoticeEditor(project, id);

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
    if (label) label.textContent = `${voluntariosAtuais} / ${voluntariosTotais} voluntários`;
}

/* ---------------------- EDITOR DO QUADRO DE AVISOS ---------------------- */

function initNoticeEditor(project, id) {
    const editBtn = document.getElementById("edit-notice-btn");
    const noticeBox = document.getElementById("notice-text");

    if (!editBtn) return;

    editBtn.addEventListener("click", () => {

        // Caixa de edição
        const textarea = document.createElement("textarea");
        textarea.id = "notice-editor";
        textarea.style.width = "100%";
        textarea.style.height = "140px";
        textarea.value = project.notice_board || "";

        // Botões
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Salvar";
        saveBtn.style.marginRight = "8px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";

        // Limpa e adiciona editor
        noticeBox.innerHTML = "";
        noticeBox.appendChild(textarea);
        noticeBox.appendChild(saveBtn);
        noticeBox.appendChild(cancelBtn);

        // SALVAR
        saveBtn.addEventListener("click", async () => {
            const novoAviso = textarea.value.trim();

            const resp = await api.updateProject(id, {
                notice_board: novoAviso
            });

            if (resp.error) {
                alert("Erro ao salvar aviso.");
                return;
            }

            project.notice_board = novoAviso;

            noticeBox.innerHTML = novoAviso
                ? novoAviso.replace(/\n/g, "<br>")
                : "Avisos ficarão aqui";
        });

        // CANCELAR
        cancelBtn.addEventListener("click", () => {
            noticeBox.innerHTML = project.notice_board
                ? project.notice_board.replace(/\n/g, "<br>")
                : "Avisos ficarão aqui";
        });
    });
}
