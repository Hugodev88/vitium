import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteHabit, toggleHabit } from '../store/habitsSlice';
import { fetchProgress } from '../store/progressSlice';
import styles from './Habit.module.css';
import { FaFire, FaCheck, FaUndo, FaTrash } from 'react-icons/fa'; // Example icon
import HabitTooltip from './HabitTooltip';

const Habit = ({ habit }) => {
  const dispatch = useDispatch();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDelete = () => {
    dispatch(deleteHabit(habit._id));
  };

  const handleToggle = async () => {
    await dispatch(toggleHabit(habit._id));
    dispatch(fetchProgress());
  };

  const isCompletedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.records.some(record => {
      const recordDate = new Date(record);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });
  };

  const getStreaks = (records) => {
    if (records.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const sortedDates = [...new Set(records.map(r => new Date(r).setHours(0, 0, 0, 0)))].sort((a, b) => b - a);

    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 24 * 60 * 60 * 1000).setHours(0,0,0,0);

    // Check for current streak
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const diff = (sortedDates[i-1] - sortedDates[i]) / (1000 * 3600 * 24);
            if (diff === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Check for longest streak
    if (sortedDates.length > 0) {
        tempStreak = 1;
        longestStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const diff = (sortedDates[i-1] - sortedDates[i]) / (1000 * 3600 * 24);
            if (diff === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }
    }

    return { currentStreak, longestStreak };
  };

  const { currentStreak, longestStreak } = getStreaks(habit.records);
  const goal = 30; // Example goal
  const progress = Math.min((currentStreak / goal) * 100, 100);

  const cardClass = styles.habitCard;

  return (
    <div 
      className={cardClass}
      data-habit-type={habit.type}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && <HabitTooltip habit={habit} longestStreak={longestStreak} />}
      <div className={styles.leftSection}>
        <FaFire className={styles.habitIcon} />
      </div>
      <div className={styles.centerSection}>
        <div className={styles.habitInfo}>
          <h3>{habit.name}</h3>
        </div>
        <div className={styles.habitDetails}>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
          <span className={styles.streak}>Streak: {currentStreak} days</span>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.actionButtons}>
          <button onClick={handleToggle} className={`${styles.iconButton} ${isCompletedToday() ? styles.undoButton : styles.completeButton}`}>
            {isCompletedToday() ? <FaUndo /> : <FaCheck />}
          </button>
          <button onClick={handleDelete} className={`${styles.iconButton} ${styles.deleteButton}`}>
            <FaTrash />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Habit;
