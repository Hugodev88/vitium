import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits } from '../store/habitsSlice';
import HabitList from '../components/HabitList';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { habits, loading, error } = useSelector(state => state.habits);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <h2 className={styles.loadingText}>Carregando seus hábitos...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Oops! Algo deu errado</h2>
          <p className={styles.errorMessage}>Erro: {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(fetchHabits())}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const goodHabits = habits?.filter(habit => habit.type === 'good') || [];
  const badHabits = habits?.filter(habit => habit.type === 'bad') || [];
  const totalHabits = habits?.length || 0;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContentWrapper}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>🎯 Seus Hábitos</h1>
            <p className={styles.subtitle}>
              Acompanhe seu progresso e construa uma rotina melhor
            </p>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{totalHabits}</h3>
                <p className={styles.statLabel}>Total de Hábitos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon + ' ' + styles.goodIcon}>✅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{goodHabits.length}</h3>
                <p className={styles.statLabel}>Hábitos Bons</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon + ' ' + styles.badIcon}>🚫</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{badHabits.length}</h3>
                <p className={styles.statLabel}>Hábitos a Evitar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className={styles.actionSection}>
          <button
            className={styles.addButton}
            onClick={() => navigate('/add-habit')}
          >
            <span className={styles.addIcon}>+</span>
            Adicionar Novo Hábito
          </button>
          <div className={styles.quickActions}>
            <button
              className={styles.quickButton}
              onClick={() => navigate('/progress')}
            >
              📈 Ver Progresso
            </button>
            <button
              className={styles.quickButton}
              onClick={() => navigate('/achievements')}
            >
              🏆 Conquistas
            </button>
          </div>
        </div>

        {/* Habits Content */}
        <div className={styles.habitsContent}>
          {totalHabits === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3>Nenhum hábito ainda</h3>
              <p>Comece criando seu primeiro hábito para começar sua jornada de transformação!</p>
              <button
                className={styles.emptyStateButton}
                onClick={() => navigate('/add-habit')}
              >
                Criar meu primeiro hábito
              </button>
            </div>
          ) : (
            <div className={styles.habitsWrapper}>
              <HabitList habits={habits} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;