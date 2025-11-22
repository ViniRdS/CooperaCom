/*document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const registerForm = document.querySelector('#registerForm');

    // LOGIN
    if (loginForm) {
        const msg = document.getElementById('loginMessage');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            msg.textContent = "Verificando...";
            msg.style.color = "#444";

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value.trim();

            const res = await api.login(email, password);

            if (res.token) {
                localStorage.setItem('token', res.token);
                msg.style.color = "green";
                msg.textContent = "Login realizado! Redirecionando...";
                setTimeout(() => window.location.href = 'index.html', 1200);
            } else {
                msg.style.color = "red";
                msg.textContent = res.message || "E-mail ou senha inválidos.";
            }
        });
    }

    // REGISTER
    if (registerForm) {
        const msg = document.getElementById('registerMessage');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            msg.textContent = "Criando conta...";
            msg.style.color = "#444";

            const data = {
                name: registerForm.name.value.trim(),
                email: registerForm.email.value.trim(),
                password: registerForm.password.value.trim()
            };

            const res = await api.register(data);

            if (res.success) {
                msg.style.color = "green";
                msg.textContent = "Cadastro realizado! Redirecionando...";
                setTimeout(() => window.location.href = 'login.html', 1200);
            } else {
                msg.style.color = "red";
                msg.textContent = res.message || "Erro ao criar conta.";
            }
        });
    }
});*/
