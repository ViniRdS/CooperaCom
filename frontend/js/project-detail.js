document.addEventListener("DOMContentLoaded", loadProjectDetail);

async function loadProjectDetail() {

    const id = getProjectIdFromURL();
    if (!id) return alert("Projeto não encontrado.");

    try {
        const project = await api.getProjectById(id);
        window.currentProject = project;

        if (!project || project.error) {
            return alert("Erro ao carregar projeto.");
        }

        // Mostrar botão de editar SE for o criador do projeto
        const user = JSON.parse(localStorage.getItem("user"));
        const editBtn = document.getElementById("edit-notice-btn");
        const editProjectBtn = document.getElementById("edit-project-btn");

        if (user && user.id === project.creator_id) {
            editBtn.style.display = "inline-block";
            editProjectBtn.style.display = "inline-block";
        }

        // Preenche dados na tela
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-description").textContent = project.description;
        document.getElementById("project-creator").textContent = project.creator_name || "Não informado";
        document.getElementById("project-category").textContent = project.category_name || "Não informado";

        const dateEl = document.getElementById("project-date");

        if (project.project_date) {
            dateEl.textContent = new Date(project.project_date).toLocaleDateString("pt-BR");
            dateEl.style.display = "inline"; 
        } else {
            dateEl.style.display = "none";
        }

        atualizarBarra(project.current_volunteer, project.number_volunteer);

        const noticeBox = document.getElementById("notice-text");
        if (project.notice_board?.trim()) {
            noticeBox.innerHTML = project.notice_board.replace(/\n/g, "<br>");
        } else {
            noticeBox.textContent = "Avisos ficarão aqui";
        }

        if (project.status === "encerrado") {
            const warning = document.createElement("div");
            warning.textContent = "⚠️ Este projeto foi encerrado.";
            warning.style.background = "#ffcccc";
            warning.style.padding = "10px";
            warning.style.marginBottom = "15px";
            warning.style.borderRadius = "6px";
            document.querySelector(".project-info").prepend(warning);

            // Ocultar botão principal
            const btn = document.getElementById("join-leave-btn");
            btn.style.display = "none";

            // bloquear edição
            document.getElementById("edit-notice-btn").style.display = "none";
            document.getElementById("edit-project-btn").style.display = "none";

            // bloquear chat
            const chatInput = document.getElementById("chat-input");
            const chatBtn = document.getElementById("chat-send-btn");
            if (chatInput) chatInput.disabled = true;
            if (chatBtn) chatBtn.disabled = true;
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
        textarea.style.height = "20em";
        textarea.value = project.notice_board || "";

        // Botões
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Salvar";
        saveBtn.style.marginRight = "8px";
        saveBtn.style.backgroundColor = "#175b43";
        saveBtn.style.color = "#fff";
        saveBtn.style.border = "none";
        saveBtn.style.padding = "6px 12px";
        saveBtn.style.borderRadius = "6px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.style.backgroundColor = "#dc3545";
        cancelBtn.style.color = "#fff";
        cancelBtn.style.border = "none";
        cancelBtn.style.padding = "6px 12px";
        cancelBtn.style.borderRadius = "6px";

        // Limpa e adiciona editor
        noticeBox.innerHTML = "";
        noticeBox.appendChild(textarea);
        noticeBox.appendChild(saveBtn);
        noticeBox.appendChild(cancelBtn);

        // SALVAR
        saveBtn.addEventListener("click", async () => {
            const novoAviso = textarea.value.trim();
            const resp = await api.updateNoticeBoard(id, novoAviso);
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

async function initJoinButton(project, id) {
    const btn = document.getElementById("join-leave-btn");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!btn) return;

    let volunteers = [];
    try {
        volunteers = await api.getVolunteers(id);
    } catch (err) {
        console.error("Erro ao buscar voluntários:", err);
    }

    const isFull = project.current_volunteer >= project.number_volunteer;

    if (!user) {
        // Usuário não logado e projeto não cheio
        if (!isFull) {
            btn.textContent = "Faça login para participar";
            btn.onclick = () => { window.location.href = "login.html"; };
            return;
        }
        // Usuário não logado e projeto cheio
        btn.textContent = "Projeto Cheio";
        btn.disabled = true;
        btn.classList.add("btn-disabled");
        return;
    }

    if (user && user.id === project.creator_id) {

    if (project.status === "encerrado") {
        btn.style.display = "none";
        return;
    }

        btn.textContent = "Encerrar Projeto";
        btn.classList.add("btn-danger");

        btn.onclick = async () => {
            if (!confirm("Tem certeza que deseja encerrar este projeto? Esta ação é irreversível.")) {
                return;
            }

            const resp = await api.closeProject(id);
            if (resp.error) {
                alert("Erro ao encerrar projeto.");
                return;
            }

            alert("Projeto encerrado com sucesso!");
            location.reload();
        };

        return;
    }

    const isVolunteer = volunteers.some(v => v.id === user.id);
    
    if (isFull && !isVolunteer && user.id !== project.creator_id) {
        btn.textContent = "Projeto Cheio";
        btn.disabled = true;
        btn.classList.add("btn-disabled");
        return;
    }
    // -----------------------------------

    if (isVolunteer) {
        btn.textContent = "Sair do projeto";
        btn.classList.add("btn-sair");
    } else {
        btn.textContent = "Participar";
        btn.classList.remove("btn-danger");
    }

    btn.onclick = async () => {
        if (isVolunteer) {
            const r = await api.leaveProject(id);
            if (!r.error) location.reload();
        } else {
            const r = await api.joinProject(id);
            if (!r.error) location.reload();
        }
    };
}

/* ---------------------- EDIÇÃO DE PROJETO ---------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const editProjectBtn = document.getElementById("edit-project-btn");
    if (!editProjectBtn) return;

    editProjectBtn.addEventListener("click", enableProjectEditor);
});

function enableProjectEditor() {
    const titleEl = document.getElementById("project-title");
    const descEl = document.getElementById("project-description");
    const catEl  = document.getElementById("project-category");
    const dateEl = document.getElementById("project-date");
    const infoBox = document.querySelector(".project-info");
    
    const projectId = getProjectIdFromURL();

    // Puxar categorias antes de abrir
    api.getCategories().then(categories => {

        const original = {
            title: titleEl.textContent,
            description: descEl.textContent,
            category: catEl.textContent,
            date: dateEl.textContent,
        };

        // LIMPA O BLOCO
        infoBox.innerHTML = "";

        // --- INPUT TÍTULO ---
        const inputTitle = document.createElement("input");
        inputTitle.className = "form-control small-input mb-2";
        inputTitle.value = original.title;

        // --- TEXTAREA DESCRIÇÃO ---
        const inputDesc = document.createElement("textarea");
        inputDesc.className = "form-control small-input mb-2";
        inputDesc.style.height = "8em";
        inputDesc.value = original.description;

        // --- SELECT CATEGORIA ---
        const selectCat = document.createElement("select");
        selectCat.className = "form-select small-input mb-2";

        categories.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;

            if (c.name === original.category) opt.selected = true;

            selectCat.appendChild(opt);
        });

        // --- INPUT Nº VOLUNTÁRIOS ---
        const inputVol = document.createElement("input");
        inputVol.type = "number";
        inputVol.min = "1";
        inputVol.className = "form-control small-input mb-2";
        inputVol.placeholder = "Número de voluntários";
        inputVol.value = window.currentProject?.number_volunteer || 1;

        // --- INPUT DATA ---
        const inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.className = "form-control small-input mb-3";

        // Se a data original for válida (dia/mês/ano), converte para yyyy-mm-dd
        if (original.date.includes("/")) {
            const [d, m, y] = original.date.split("/");
            inputDate.value = `${y}-${m}-${d}`;
        }

        // Botões
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Salvar";
        saveBtn.style.marginRight = "8px";
        saveBtn.style.backgroundColor = "#175b43";
        saveBtn.style.color = "#fff";
        saveBtn.style.border = "none";
        saveBtn.style.padding = "6px 12px";
        saveBtn.style.borderRadius = "6px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.style.backgroundColor = "#dc3545";
        cancelBtn.style.color = "#fff";
        cancelBtn.style.border = "none";
        cancelBtn.style.padding = "6px 12px";
        cancelBtn.style.borderRadius = "6px";

        // Adiciona ao HTML
        infoBox.appendChild(inputTitle);
        infoBox.appendChild(inputDesc);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "12px";
        row.style.marginBottom = "12px";

        selectCat.style.flex = "1";
        inputVol.style.flex = "1";
        inputDate.style.flex = "1";

        row.appendChild(selectCat);
        row.appendChild(inputVol);
        row.appendChild(inputDate);

        infoBox.appendChild(row);

        infoBox.appendChild(saveBtn);
        infoBox.appendChild(cancelBtn);

        // SALVAR
        saveBtn.addEventListener("click", async () => {
            try {
                // busca a versão mais atual do projeto no banco
                const latest = await api.getProjectById(projectId);
                const currentVolunteers = (latest && latest.current_volunteer) ? Number(latest.current_volunteer) : 0;

                const newVolunteers = Number(inputVol.value);

                //número válido e maior que zero
                if (isNaN(newVolunteers) || newVolunteers <= 0) {
                    alert("O número de voluntários deve ser maior que zero.");
                    return;
                }

                //não pode ser menor que quem já participa atualmente
                if (newVolunteers < currentVolunteers) {
                    alert(`O número de vagas não pode ser menor que ${currentVolunteers}, que já participam do projeto.`);
                    return;
                }

                //se não houve mudanças, evita requisição
                const title = inputTitle.value.trim();
                const description = inputDesc.value.trim();
                const category_id = Number(selectCat.value);
                const project_date = inputDate.value || null;

                const payload = {
                    title,
                    description,
                    category_id,
                    number_volunteer: newVolunteers,
                    project_date
                };

                // faz a atualização
                const resp = await api.updateProject(projectId, payload);

                if (resp.error) {
                    alert("Erro ao atualizar projeto: " + (resp.error || resp.message || ""));
                    return;
                }
               
                location.reload();
            } catch (err) {
                console.error("Erro ao salvar alterações do projeto:", err);
                alert("Erro ao atualizar projeto.");
            }
        });


        // CANCELAR
        cancelBtn.addEventListener("click", () => {
            location.reload();
        });
    });
}