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
    return <h2 className="text-center">Loading Habits...</h2>;
  }

  if (error) {
    return <h2 className="text-center error-message">Error: {error}</h2>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className="text-center">Your Habits</h2>
      <button onClick={() => navigate('/add-habit')} style={{ marginBottom: '20px' }}>Add New Habit</button>
      <HabitList habits={habits} />
    </div>
  );
};

export default Dashboard;
