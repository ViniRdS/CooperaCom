const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/contact', contactRoutes);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
