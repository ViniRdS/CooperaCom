document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('settings-form');
    const deleteBtn = document.getElementById('delete-account');

    // Carregar dados atuais do usuário
    try {
        const user = await api.getUserProfile();
        document.getElementById('name').value = user.name;
        document.getElementById('bio').value = user.bio || '';
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar os dados do usuário.');
    }

    // Salvar alterações
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            bio: document.getElementById('bio').value,
            password: document.getElementById('password').value || undefined
        };

        try {
            await api.updateProfile(data);
            alert('Alterações salvas com sucesso!');
            document.getElementById('password').value = ''; // limpa o campo de senha
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar alterações. Tente novamente.');
        }
    });

    // Excluir conta
    deleteBtn.addEventListener('click', async () => {
        const confirmDelete = confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
        if (!confirmDelete) return;

        try {
            await api.deleteUser();
            localStorage.removeItem('token');
            alert('Conta excluída com sucesso.');
            window.location.href = 'index.html';
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir conta. Tente novamente.');
        }
    });
});
