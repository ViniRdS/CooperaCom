// === Este arquivo foi limpo para evitar duplicações ===
// Agora a NAVBAR é carregada SOMENTE via components.js
// Este arquivo mantém apenas funções adicionais necessárias

// === Botão "Criar Projeto" global ===
document.addEventListener('DOMContentLoaded', () => {
    setupCreateProjectButton();
});

function setupCreateProjectButton() {
    const btn = document.getElementById('create-project-btn');
    if (!btn) return;

    btn.addEventListener('click', e => {
        e.preventDefault();

        if (localStorage.getItem('token')) {
            window.location.href = 'create-project.html';
        } else {
            window.location.href = 'login.html';
        }
    });
}
