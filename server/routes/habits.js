const express = require('express');
const router = express.Router();

const {
  getAllHabits,
  createHabit,
  getHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/habits');

router.route('/').get(getAllHabits).post(createHabit);
router.route('/:id').get(getHabit).patch(updateHabit).delete(deleteHabit);

module.exports = router;
