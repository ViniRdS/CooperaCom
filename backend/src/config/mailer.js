const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendContactEmail(name, email, message) {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_TO,
    subject: `Mensagem de contato - ${name}`,
    text: `
      Nome: ${name}
      Email: ${email}
      Mensagem:
      ${message}
    `,
    replyTo: email
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };