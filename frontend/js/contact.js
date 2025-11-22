document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };

        try {
            await api.contactMessage(data);
            messageEl.style.color = 'green';
            messageEl.textContent = 'Mensagem enviada com sucesso!';
            form.reset();
        } catch (err) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Erro ao enviar mensagem. Tente novamente.';
            console.error(err);
        }
    });
});
