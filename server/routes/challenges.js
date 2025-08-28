const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getSingleChallenge,
  createChallenge,
  joinChallenge,
  leaveChallenge,
} = require('../controllers/challenges');
const authenticateUser = require('../middleware/authentication');

// Admin route for creating challenges (for now, accessible by authenticated users)
router.route('/').post(authenticateUser, createChallenge).get(authenticateUser, getAllChallenges);
router.route('/:id').get(authenticateUser, getSingleChallenge);
router.route('/:id/join').post(authenticateUser, joinChallenge);
router.route('/:id/leave').post(authenticateUser, leaveChallenge);

module.exports = router;
