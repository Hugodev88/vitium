import { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './Progress.module.css'; // Reusing some styles from Progress

const Streaks = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get('/progress');
        setProgress(data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <h2 className="text-center">Loading Streaks...</h2>;
  }

  if (error) {
    return <h2 className="text-center error-message">Error: {error}</h2>;
  }

  return (
    <div className={styles.progressContainer}> {/* Reusing progressContainer style */}
      <h2>Your Streaks</h2>
      <div className={styles.streaksList}>
        {progress.streaks.length === 0 ? (
          <p>No streaks yet. Keep tracking your habits!</p>
        ) : (
          progress.streaks.map(item => (
            <div key={item.habitId} className={`${styles.streakItem} card`}>
              <h4>{item.name}</h4>
              <p>{item.streak} day{item.streak !== 1 ? 's' : ''} streak</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Streaks;
