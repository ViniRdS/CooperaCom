document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("settings-form");
    const deleteBtn = document.getElementById("delete-account");

    /* ======================================================
       1. CARREGAR DADOS DO USUÁRIO DO LOCALSTORAGE
    ====================================================== */
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    let user = JSON.parse(storedUser);

    document.getElementById("name").value = user.name || "";
    document.getElementById("bio").value = user.bio || "";

    /* ======================================================
       2. SALVAR ALTERAÇÕES
    ====================================================== */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Campos básicos
        const updateData = {
            name: document.getElementById("name").value,
            bio: document.getElementById("bio").value
        };

        // SENHA — só envia se tiver algo digitado
        const newPassword = document.getElementById("password").value.trim();
        if (newPassword.length > 0) {
            updateData.password = newPassword;
        }

        try {
            const updatedUser = await api.updateProfile(updateData);

            /* ======================================================
               ATUALIZA LOCALSTORAGE PARA NAVBAR E PROFILE
            ====================================================== */
            localStorage.setItem("user", JSON.stringify(updatedUser));

            /* ======================================================
               ATUALIZA NAVBAR AO VIVO
            ====================================================== */
            if (window.setupNavbar) setupNavbar();

            alert("Alterações salvas com sucesso!");

            // limpa campo de senha
            document.getElementById("password").value = "";

        } catch (err) {
            console.error("Erro ao atualizar perfil:", err);
            alert("Erro ao salvar alterações. Tente novamente.");
        }
    });

    /* ======================================================
       3. EXCLUIR CONTA
    ====================================================== */
    deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(
            "Deseja realmente excluir sua conta? Esta ação é irreversível."
        );
        if (!confirmDelete) return;

        try {
            await api.deleteUser();

            // Remover dados locais
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            alert("Conta excluída com sucesso.");
            window.location.href = "index.html";

        } catch (err) {
            console.error("Erro ao excluir conta:", err);
            alert("Erro ao excluir a conta. Tente novamente.");
        }
    });
});
