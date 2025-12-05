const SOCKET_SERVER_URL = 'http://localhost:3000'; // ajuste se seu backend usa outra porta

let socket = null;
let currentProjectId = null;

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


function initChat(projectId, projectObj = null) {
  currentProjectId = Number(projectId);
  if (!currentProjectId) return;

  const token = localStorage.getItem('token');
  if (!token) {
    renderChatReadOnly();
    return;
  }

  socket = io(SOCKET_SERVER_URL, {
    auth: { token }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error:', err.message);
    showChatError(err.message);
  });

  socket.on('connect', () => {
    socket.emit('join_project', currentProjectId);
  });

  socket.on('joined_project', (data) => {
    loadHistoryAndBindSend();
  });

  socket.on('error_message', (d) => {
    showChatError(d.message || 'Erro no chat');
  });

  socket.on('new_message', (msg) => {
    appendMessage(msg);
  });
}

function renderChatReadOnly() {
  const box = document.getElementById('chat-messages');
  box.innerHTML = '<p class="text-muted">Faça login para participar do chat.</p>';
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  if (input) input.disabled = true;
  if (btn) btn.disabled = true;
}

function showChatError(text) {
  const box = document.getElementById('chat-messages');
  //box.insertAdjacentHTML('beforeend', `<div class="text-danger small">${escapeHtml(text)}</div>`);
  box.innerHTML = `<p class="text-muted">${escapeHtml(text)}</p>`;
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  if (input) input.disabled = true;
  if (btn) btn.disabled = true;
}

async function loadHistoryAndBindSend() {
  try {
    const msgsRes = await api.getProjectMessages(currentProjectId);
    const messages = msgsRes.messages || msgsRes;
    const box = document.getElementById('chat-messages');
    box.innerHTML = '';
    messages.forEach(m => appendMessage(m));
  } catch (err) {
    console.error('Erro ao carregar histórico', err);
  }

  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  if (!input || !btn) return;

  btn.onclick = async () => {
    const content = input.value.trim();
    if (!content) return;
    socket.emit('send_message', { projectId: currentProjectId, content });
    input.value = '';
  };
}

function appendMessage(msg) {
  const box = document.getElementById('chat-messages');
  if (!box) return;
  const dt = new Date(msg.created_at || msg.createdAt || Date.now()).toLocaleString();
  const sender = msg.sender_name || msg.sender_id || 'Usuário';
  const html = `<div class="chat-line"><strong>${escapeHtml(sender)}</strong> <small class="text-muted">(${escapeHtml(dt)})</small><div>${escapeHtml(msg.content)}</div></div>`;
  box.insertAdjacentHTML('beforeend', html);
  box.scrollTop = box.scrollHeight;
}
