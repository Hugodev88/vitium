const express = require('express');
const router = express.Router();

const { markChallengeDayComplete, getUserChallengeProgress, unmarkChallengeDayComplete } = require('../controllers/userChallenges');

router.route('/:challengeId/complete').post(markChallengeDayComplete);
router.route('/:challengeId/uncomplete').post(unmarkChallengeDayComplete);
router.route('/:challengeId/progress').get(getUserChallengeProgress);

module.exports = router;