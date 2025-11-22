document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('create-project-form');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            category: form.category.value,
            volunteers: form.volunteers.value ? parseInt(form.volunteers.value) : null,
            date: form.date.value
        };

        message.textContent = "Criando projeto...";
        message.style.color = "#444";

        try {
            const result = await api.createProject(data);

            if (result.error) {
                message.style.color = 'red';
                message.textContent = result.error;
                return;
            }

            message.style.color = 'green';
            message.textContent = 'Projeto criado com sucesso! Redirecionando...';

            setTimeout(() => {
                window.location.href = 'projects.html';
            }, 1500);

        } catch (err) {
            message.style.color = 'red';
            message.textContent = 'Erro ao criar projeto. Tente novamente.';
            console.error(err);
        }
    });
});
