import React from 'react';
import styles from './HabitTooltip.module.css';

const HabitTooltip = ({ habit, longestStreak }) => {
  const completionCount = habit.records.length;

  return (
    <div className={styles.tooltipContainer}>
      <p>Longest Streak: {longestStreak} days</p>
      <p>Total Completions: {completionCount}</p>
    </div>
  );
};

export default HabitTooltip;
