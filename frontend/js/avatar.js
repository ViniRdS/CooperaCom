document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("avatar-input");
    const previewImg = document.getElementById("user-avatar");

    if (!fileInput) return;

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview imediato
        previewImg.src = URL.createObjectURL(file);

        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("avatar", file);

        const res = await fetch("http://localhost:3001/api/upload/avatar", {
            method: "POST",
            body: form,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!data.url) {
            console.error("Upload falhou:", data);
            return;
        }

        // Atualiza avatar na página com a URL do servidor
        previewImg.src = data.url;

        // Atualiza user no localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        user.avatar = data.url;
        localStorage.setItem("user", JSON.stringify(user));

        // Atualiza navbar
        if (window.setupNavbar) setupNavbar();
    });
});
