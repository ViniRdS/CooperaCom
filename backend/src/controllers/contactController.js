const { sendContactEmail } = require('../config/mailer');

async function sendMessage(req, res) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    await sendContactEmail(name, email, message);
    res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de contato:', error);
    res.status(500).json({ message: 'Erro ao enviar a mensagem. Tente novamente mais tarde.' });
  }
}

module.exports = { sendMessage };