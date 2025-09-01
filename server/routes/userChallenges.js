const express = require('express');
const router = express.Router();

const { markChallengeDayComplete, getUserChallengeProgress } = require('../controllers/userChallenges');

router.route('/:challengeId/complete').post(markChallengeDayComplete);
router.route('/:challengeId/progress').get(getUserChallengeProgress);

module.exports = router;