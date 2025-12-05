const { getMessagesByProject, saveMessage } = require('../services/messagesService');

async function getProjectMessages(req, res) {
  const projectId = Number(req.params.projectId);
  try {
    const msgs = await getMessagesByProject(projectId, 1000);
    res.json({ success: true, messages: msgs });
  } catch (err) {
    console.error('getProjectMessages error', err);
    res.status(500).json({ success: false, message: 'Erro ao obter mensagens' });
  }
}

async function postProjectMessage(req, res) {
  const projectId = Number(req.params.projectId);
  const senderId = req.userId;
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    return res.status(400).json({ success: false, message: 'Mensagem vazia' });
  }

  try {
    const msg = await saveMessage(projectId, senderId, content);
    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error('postProjectMessage error', err);
    res.status(500).json({ success: false, message: 'Erro ao enviar mensagem' });
  }
}

module.exports = { getProjectMessages, postProjectMessage };
