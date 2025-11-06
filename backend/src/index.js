const express = require('express');

const app = express();

const port = process.env.PORT || 3001;

const healthRoutes = require('./routes/health');
app.use('/api/health', healthRoutes);

app.listen(port, () => console.log(`Servidor rodando na porta${port}`));
