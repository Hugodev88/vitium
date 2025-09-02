import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProgress } from '../store/progressSlice';
import styles from './Progress.module.css';
import HabitCalendar from '../components/HabitCalendar';

const Progress = () => {
  const dispatch = useDispatch();
  const { progress, habits, loading, error } = useSelector(state => state.progress);

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.progressContainer}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <h2 className={styles.loadingText}>Carregando seu progresso...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.progressContainer}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>📊</div>
          <h2 className={styles.errorTitle}>Erro ao carregar progresso</h2>
          <p className={styles.errorMessage}>Erro: {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(fetchProgress())}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular porcentagem de conclusão
  const completionRate = progress.totalHabits > 0
    ? Math.round(((progress.goodHabitsCompleted + progress.badHabitsAvoided) / progress.totalHabits) * 100)
    : 0;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>📈</span>
          Seu Progresso
        </h1>
        <p className={styles.subtitle}>Acompanhe sua evolução e celebre suas conquistas</p>
      </div>

      {/* Progress Overview */}
      <div className={styles.overviewSection}>
        <div className={styles.mainProgressCard}>
          <div className={styles.progressHeader}>
            <h3>Resumo do Progresso</h3>
            <div className={styles.progressBadge}>
              {completionRate}% concluído hoje
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{completionRate}% dos hábitos completados</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.totalIcon}>📋</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{progress.totalHabits}</h3>
            <p className={styles.statLabel}>Total de Hábitos</p>
            <div className={styles.statSubtext}>Meta diária</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.goodIcon}>✅</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{progress.goodHabitsCompleted}</h3>
            <p className={styles.statLabel}>Hábitos Bons</p>
            <div className={styles.statSubtext}>Completos hoje</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.badIcon}>🚫</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{progress.badHabitsAvoided}</h3>
            <p className={styles.statLabel}>Hábitos Ruins</p>
            <div className={styles.statSubtext}>Evitados hoje</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.streakIcon}>🔥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{progress.streak || 0}</h3>
            <p className={styles.statLabel}>Sequência</p>
            <div className={styles.statSubtext}>Dias consecutivos</div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <h3>🏆 Conquistas Recentes</h3>
        </div>

        <div className={styles.achievementsList}>
          {completionRate === 100 && (
            <div className={styles.achievementItem}>
              <span className={styles.achievementIcon}>🎯</span>
              <div className={styles.achievementContent}>
                <h4>Dia Perfeito!</h4>
                <p>Você completou todos os seus hábitos hoje</p>
              </div>
            </div>
          )}

          {(progress.streak || 0) >= 7 && (
            <div className={styles.achievementItem}>
              <span className={styles.achievementIcon}>⚡</span>
              <div className={styles.achievementContent}>
                <h4>Semana de Ouro</h4>
                <p>7 dias consecutivos de progresso</p>
              </div>
            </div>
          )}

          {progress.goodHabitsCompleted >= 5 && (
            <div className={styles.achievementItem}>
              <span className={styles.achievementIcon}>💪</span>
              <div className={styles.achievementContent}>
                <h4>Super Produtivo</h4>
                <p>5+ hábitos bons completados</p>
              </div>
            </div>
          )}

          {progress.totalHabits === 0 && (
            <div className={styles.noAchievements}>
              <p>Complete seus hábitos para desbloquear conquistas! 🎉</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Section */}
      <div className={styles.calendarSection}>
        <div className={styles.sectionHeader}>
          <h3>📅 Calendário de Hábitos</h3>
          <p>Visualize seu progresso ao longo do tempo</p>
        </div>

        <div className={styles.calendarWrapper}>
          <HabitCalendar habits={habits || []} />
        </div>
      </div>
    </div>
  );
};

export default Progress;