function loadComponent(selector, url) {
    const el = document.querySelector(selector);

    if (!el) return; // Sai se não existir

    return fetch(url)
        .then(response => response.text())
        .then(data => {
            el.innerHTML = data;
            return el; // retorna o elemento para encadear ações
        })
        .catch(error => console.error(`Erro ao carregar componente "${url}":`, error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Carregar Navbar e atualizar links se o usuário estiver logado
    loadComponent("header", "components/navbar.html").then(() => {
        const loginLink = document.querySelector('.login-link');
        const registerLink = document.querySelector('.register-link');

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && loginLink && registerLink) {
            loginLink.innerHTML = `<a href="profile.html">${user.name}</a>`;
            registerLink.style.display = 'none';
        }
    });

    // Carregar Footer
    loadComponent("footer", "components/footer.html");

    // Carregar Project Card (se existir)
    loadComponent("#project-card-container", "components/project-card.html");

    function updateProjectCards() {
    document.querySelectorAll(".project-card").forEach(card => {
        const slotsText = card.querySelector(".project-slots span").innerText; 
        const [current, max] = slotsText.split("/").map(n => parseInt(n.trim()));

        const bar = card.querySelector(".progress-bar");
        const percent = (current / max) * 100;

        bar.style.width = percent + "%";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#project-card-container", "components/project-card.html")
        .then(() => {
            updateProjectCards();
        });
});

});
