const express = require('express');
const router = express.Router();
const { getAllChallenges, getUpcomingChallenges, getSingleChallenge, updateChallenge, deleteChallenge, joinChallenge, leaveChallenge, } = require('../controllers/challenges');
const authenticateUser = require('../middleware/authentication');

// Admin routes (for now, accessible by authenticated users)
router.route('/').get(authenticateUser, getAllChallenges);
router.route('/upcoming').get(authenticateUser, getUpcomingChallenges);
router.route('/:id').get(authenticateUser, getSingleChallenge).patch(authenticateUser, updateChallenge).delete(authenticateUser, deleteChallenge);

// User routes
router.route('/:id/join').post(authenticateUser, joinChallenge);
router.route('/:id/leave').post(authenticateUser, leaveChallenge);

module.exports = router;
