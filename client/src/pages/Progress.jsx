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
    return <h2 className="text-center">Carregando Progresso...</h2>;
  }

  if (error) {
    return <h2 className="text-center error-message">Erro: {error}</h2>;
  }

  return (
    <div className={styles.progressContainer}>
      <h2>Seu Progresso</h2>
      <div className={`${styles.progressSummary} card`}>
        <p><strong>Total de Hábitos:</strong> {progress.totalHabits}</p>
        <p><strong>Hábitos Bons Completos:</strong> {progress.goodHabitsCompleted}</p>
        <p><strong>Hábitos Ruins Evitados:</strong> {progress.badHabitsAvoided}</p>
      </div>
      <HabitCalendar habits={habits} />
    </div>
  );
};

export default Progress;
