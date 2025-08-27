const express = require('express');
const router = express.Router();
const { getProgress } = require('../controllers/progress');

router.route('/').get(getProgress);

module.exports = router;
