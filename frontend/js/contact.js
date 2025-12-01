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

        messageEl.style.color = "#444";
        messageEl.textContent = "Enviando mensagem...";

        try {
            const res = await api.contactMessage(data);

            messageEl.style.color = "green";
            messageEl.textContent = res.message;

            form.reset();

            setTimeout(() => {
                messageEl.textContent = "";
            }, 3000);

        } catch (err) {
            messageEl.style.color = "red";
            messageEl.textContent = "Erro ao enviar mensagem. Tente novamente.";
            setTimeout(() => {
                messageEl.textContent = "";
            }, 3000);

            console.error(err);
        }
    });
});
