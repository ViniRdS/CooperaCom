const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const { requireProjectMembership } = require('../middleware/chatPermissions');
const { getProjectMessages, postProjectMessage } = require('../controllers/messagesController');

router.get('/projects/:projectId', requireAuth, requireProjectMembership, getProjectMessages);

router.post('/projects/:projectId', requireAuth, requireProjectMembership, postProjectMessage);

module.exports = router;
