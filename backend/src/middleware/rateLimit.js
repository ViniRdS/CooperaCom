const rateLimit = require('express-rate-limit');

// Limite para criação de projetos
const createProjectLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 1,
    message: 'Aguarde alguns segundos antes de criar outro projeto',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.userId || req.ip
});

const contactLimiter = rateLimit({
    windowMs: 6 * 1000,
    max: 1,
    message: 'Aguarde antes de enviar outra mensagem',
    keyGenerator: (req) => req.ip
});
module.exports = { createProjectLimiter, contactLimiter };
