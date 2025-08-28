import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './Achievements.module.css';


const Achievements = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  const [achievements, setAchievements] = useState([]); // sempre array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user || !token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('/api/v1/achievements', config);

        // garante que seja array
        const data = response.data.achievements;
        setAchievements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to fetch achievements.');
        setAchievements([]); // evita erro de undefined
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user, token]);

  if (loading) {
    return <div className={styles.container}>Loading achievements...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Achievements</h2>
      <div className={styles.grid}>
        {achievements.length === 0 ? (
          <p>No achievements found yet. Keep tracking your habits!</p>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement._id}
              className={`${styles.card} ${achievement.unlocked ? styles.unlocked : styles.locked
                }`}
            >
              <img
                src={`/assets/achievements/${achievement.icon}`}
                alt={achievement.name}
                className={styles.icon}
              />
              <h3 className={styles.cardTitle}>{achievement.name}</h3>
              <p className={styles.description}>{achievement.description}</p>
              {achievement.unlocked && (
                <span className={styles.unlockedTag}>Unlocked!</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
