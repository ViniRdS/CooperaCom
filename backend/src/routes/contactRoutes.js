const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimit');

router.post('/', contactLimiter, sendMessage);

module.exports = router;