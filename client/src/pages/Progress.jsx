import { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './Progress.module.css';
import HabitCalendar from '../components/HabitCalendar';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [habits, setHabits] = useState([]); // State to store habits for the calendar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressData = await api.get('/progress');
        setProgress(progressData.data);

        const habitsData = await api.get('/habits');
        setHabits(habitsData.data.habits);

      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <h2 className="text-center">Loading Progress...</h2>;
  }

  if (error) {
    return <h2 className="text-center error-message">Error: {error}</h2>;
  }

  return (
    <div className={styles.progressContainer}>
      <h2>Your Progress</h2>
      <div className={`${styles.progressSummary} card`}>
        <p><strong>Total Habits:</strong> {progress.totalHabits}</p>
        <p><strong>Good Habits Completed:</strong> {progress.goodHabitsCompleted}</p>
        <p><strong>Bad Habits Avoided:</strong> {progress.badHabitsAvoided}</p>
      </div>
      <HabitCalendar habits={habits} /> {/* Add the calendar component */}
    </div>
  );
};

export default Progress;
