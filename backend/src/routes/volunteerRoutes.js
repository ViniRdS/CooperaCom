const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { join, leave, removeVolunteer, getVolunteers } = require('../controllers/volunteerController');

const router = express.Router();

router.post('/:projectId/join', requireAuth, join);

router.delete('/:projectId/leave', requireAuth, leave);

router.delete('/:projectId/remove/:userId', requireAuth, removeVolunteer);

router.get('/:projectId', getVolunteers);

module.exports = router;
