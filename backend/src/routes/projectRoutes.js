const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { create, list, getOne, update, updateNotice, close } = require('../controllers/projectController');

//Público
router.get('/', list);
router.get('/:id', getOne);

//Privado (usuário autenticado)
router.post('/', requireAuth, create);
router.put('/:id', requireAuth, update);
router.patch('/:id/notice', requireAuth, updateNotice);
router.patch('/:id/close', requireAuth, close);

module.exports = router;
