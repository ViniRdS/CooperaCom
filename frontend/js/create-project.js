document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('create-project-form');
    const message = document.getElementById('message');
    const categorySelect = document.getElementById('category');

    try {
        const categories = await api.getCategories();
        categorySelect.innerHTML = '<option value="">Categoria</option>';

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;  
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        categorySelect.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const numVol = Number(form.volunteers.value);

        //validar mínimo de 1
        if (isNaN(numVol) || numVol < 1) {
            message.style.color = 'red';
            message.textContent = "O número de voluntários deve ser pelo menos 1.";
            return;
        }

        const data = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            category_id: Number(form.category.value),
            number_volunteer: Number(form.volunteers.value),
            project_date: form.date.value || null
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
