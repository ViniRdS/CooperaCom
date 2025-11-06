const express = require('express');
const router = express.Router();
const { getUser, updateUserProfile, deleteUserAccount } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUserProfile);
router.delete('/:id', requireAuth, deleteUserAccount);

module.exports = router;
