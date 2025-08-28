const express = require('express');
const router = express.Router();
const { getAllAchievements, unlockAchievement } = require('../controllers/achievements');
const authenticateUser = require('../middleware/authentication');

router.route('/').get(authenticateUser, getAllAchievements);
router.route('/unlock').post(authenticateUser, unlockAchievement); // This route might be used internally or for testing

module.exports = router;
