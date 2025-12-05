const express = require('express');
const router = express.Router();
const { getUser, updateUserProfile, deleteUserAccount, getCreatedProjects, getJoinedProjects } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUserProfile);
router.delete('/:id', requireAuth, deleteUserAccount);
router.get('/:id/projects/created', getCreatedProjects);
router.get('/:id/projects/joined', getJoinedProjects);
module.exports = router;
