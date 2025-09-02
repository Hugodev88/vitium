import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStreaks } from '../store/streaksSlice';
import styles from './Streaks.module.css';

const Streaks = () => {
  const dispatch = useDispatch();
  const { progress, loading, error } = useSelector(state => state.streaks);

  useEffect(() => {
    dispatch(fetchStreaks());
  }, [dispatch]);

  if (loading) {
    return <h2 className={styles.title}>Carregando Sequências...</h2>;
  }

  if (error) {
    return <h2 className={styles.error}>Erro: {error}</h2>;
  }

  return (
    <div className={styles.progressContainer}>
      <h2 className={styles.title}>Suas Sequências</h2>
      <div className={styles.streaksList}>
        {progress && progress.streaks && progress.streaks.length === 0 ? (
          <p>Nenhuma sequência ainda. Continue acompanhando seus hábitos!</p>
        ) : (
          progress && progress.streaks && progress.streaks.map(item => (
            <div key={item.habitId} className={styles.streakItem}>
              <h4>{item.name}</h4>
              <p>{item.streak} dia{item.streak !== 1 ? 's' : ''} de sequência</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Streaks;
