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
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Carregando suas conquistas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Oops! Algo deu errado</h3>
          <p className={styles.error}>Erro: {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(fetchAchievements())}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements?.filter(achievement => achievement.unlocked).length || 0;
  const totalCount = achievements?.length || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏆 Suas Conquistas</h1>
        <div className={styles.progressBar}>
          <div className={styles.progressStats}>
            <span className={styles.progressText}>
              {unlockedCount} de {totalCount} conquistas desbloqueadas
            </span>
            <span className={styles.progressPercentage}>
              {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {achievements?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3>Nenhuma conquista disponível</h3>
            <p>Continue acompanhando seus hábitos para desbloquear conquistas incríveis!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {achievements?.map((achievement) => (
              <div
                key={achievement._id}
                className={`${styles.card} ${achievement.unlocked ? styles.unlocked : styles.locked
                  }`}
              >
                {achievement.unlocked && (
                  <div className={styles.unlockedBadge}>
                    <span className={styles.badgeText}>✓</span>
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <img
                      src={`/assets/achievements/${achievement.icon || 'default_achievement.svg'}`}
                      alt={achievement.name}
                      className={styles.icon}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGRkQ3MDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMkw5LjA5IDguMjZMMiA5TDcgMTRMNS44MiAyMUwxMiAxN0wxOC4xOCAyMUwxNyAxNEwyMiA5TDE0LjkxIDguMjZMMTIgMloiIGZpbGw9IiNGRkYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                      }}
                    />
                    {!achievement.unlocked && (
                      <div className={styles.lockOverlay}>
                        <span className={styles.lockIcon}>🔒</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{achievement.name}</h3>
                  <p className={styles.description}>{achievement.description}</p>

                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className={styles.unlockedDate}>
                      Desbloqueado em {new Date(achievement.unlockedDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {achievement.unlocked ? (
                    <span className={styles.statusBadge + ' ' + styles.unlockedStatus}>
                      Conquistado! 🎉
                    </span>
                  ) : (
                    <span className={styles.statusBadge + ' ' + styles.lockedStatus}>
                      Em progresso...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;