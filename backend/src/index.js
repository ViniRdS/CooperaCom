const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);

const setupWebSocket = require('./websocket');

app.use(cors());
app.use(express.json());

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messagesRoutes');

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messageRoutes);

setupWebSocket(server);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
