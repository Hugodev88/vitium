import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAchievements } from '../store/achievementsSlice';
import styles from './Achievements.module.css';

const Achievements = () => {
  const dispatch = useDispatch();
  const { achievements, loading, error } = useSelector((state) => state.achievements);

  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  if (loading) {
    return <div className={styles.container}>Carregando conquistas...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Suas Conquistas</h2>
      <div className={styles.grid}>
        {achievements.length === 0 ? (
          <p>Nenhuma conquista encontrada ainda. Continue acompanhando seus hábitos!</p>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement._id}
              className={`${styles.card} ${achievement.unlocked ? styles.unlocked : styles.locked
                }`}
            >
              <img
                src={`/assets/achievements/${achievement.icon || 'default_achievement.svg'}`}
                alt={achievement.name}
                className={styles.icon}
              />
              <h3 className={styles.cardTitle}>{achievement.name}</h3>
              <p className={styles.description}>{achievement.description}</p>
              {achievement.unlocked && (
                <span className={styles.unlockedTag}>Desbloqueado!</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
