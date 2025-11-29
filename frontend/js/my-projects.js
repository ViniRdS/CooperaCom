let currentPage = 1;
const perPage = 6;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadProjects();
    document.getElementById("loadMoreBtn").addEventListener("click", loadProjects);
});

function loadProjects() {
    api.getProjects({ page: currentPage, limit: perPage })
        .then(response => {
            const projects = response.data || response.projects || response || [];
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const container = document.getElementById("my-projects-list");

            // Filtra apenas os projetos criados pelo usuário
            const myProjects = projects.filter(p => p.createdByUserId === user.id);

            if (myProjects.length === 0 && currentPage === 1) {
                container.innerHTML = `
                    <p class="text-center text-muted mt-4">
                        Você ainda não criou nenhum projeto.
                    </p>
                `;
                document.getElementById("loadMoreBtn").style.display = "none";
                return;
            }

            myProjects.forEach(project => {
                container.innerHTML += document.querySelector("#card-template").innerHTML
                    .replace(/__TITLE__/g, project.title)
                    .replace(/__DESCRIPTION__/g, project.description)
                    .replace(/__CATEGORY__/g, project.category || "Sem categoria")
                    .replace(/__CREATOR__/g, user.name)
                    .replace(/__VOLUNTEERS__/g, project.volunteers?.length || 0)
                    .replace(/__LIMIT__/g, project.maxVolunteers || 50)
                    .replace(/__ID__/g, project.id);
            });

            if (myProjects.length < perPage) {
                document.getElementById("loadMoreBtn").style.display = "none";
            }

            currentPage++;
        })
        .catch(err => console.error("Erro ao carregar projetos:", err));
}
