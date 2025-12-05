const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const { saveMessage } = require('./services/messagesService');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function setupWebSocket(server) {
  const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:8001',          // frontend local
      'https://cooperacom-front.pages.dev/'  // frontend produção
    ],
    methods: ['GET', 'POST']
  }
});

  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token não fornecido'));
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      socket.user = { id: payload.userId || payload.id || payload.userId };
      return next();
    } catch (err) {
      console.warn('socket auth failed:', err.message);
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`Socket conectado: ${socket.id} user=${userId}`);

    socket.on('join_project', async (projectId) => {
      try {
        projectId = Number(projectId);
        if (!projectId) {
          socket.emit('error_message', { message: 'projectId inválido' });
          return;
        }

        const pRes = await pool.query('SELECT id, status, creator_id FROM projects WHERE id = $1', [projectId]);
        const project = pRes.rows[0];
        if (!project) {
          socket.emit('error_message', { message: 'Projeto não encontrado' });
          return;
        }

        if (project.creator_id === userId) {
          socket.join(`project_${projectId}`);
          socket.emit('joined_project', { projectId });
          return;
        }

        const vRes = await pool.query('SELECT 1 FROM volunteers WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
        if (vRes.rows.length === 0) {
          socket.emit('error_message', { message: 'Apenas criador ou voluntários podem entrar no chat' });
          return;
        }

        socket.join(`project_${projectId}`);
        socket.emit('joined_project', { projectId });
      } catch (err) {
        console.error('join_project error', err);
        socket.emit('error_message', { message: 'Erro ao entrar na sala' });
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const { projectId, content } = data;
        if (!projectId || !content || !String(content).trim()) return;

        const pRes = await pool.query('SELECT id, status, creator_id FROM projects WHERE id = $1', [projectId]);
        const project = pRes.rows[0];

        if (!project) {
          socket.emit('error_message', { message: 'Projeto não encontrado' });
          return;
        }

        const isCreator = project.creator_id === socket.user.id;
        const vRes = await pool.query('SELECT 1 FROM volunteers WHERE project_id = $1 AND user_id = $2', [projectId, socket.user.id]);
        if (!isCreator && vRes.rows.length === 0) {
          socket.emit('error_message', { message: 'Você não pode enviar mensagem neste projeto' });
          return;
        }

        const msg = await saveMessage(projectId, socket.user.id, content);

        io.to(`project_${projectId}`).emit('new_message', msg);
      } catch (err) {
        console.error('send_message error', err);
        socket.emit('error_message', { message: 'Erro interno ao enviar mensagem' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });

  console.log('Socket.IO inicializado');
}

module.exports = setupWebSocket;
