const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactEmail(name, email, message) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.EMAIL_TO,
    reply_to: email,
    subject: `Mensagem de contato - ${name}`,
    text: `
      Nome: ${name}
      Email: ${email}
      Mensagem:
      ${message}
    `
  });
}

module.exports = { sendContactEmail };
