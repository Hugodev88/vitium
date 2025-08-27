import { useDispatch } from 'react-redux';
import { deleteHabit, toggleHabit } from '../store/habitsSlice';
import styles from './Habit.module.css';

const Habit = ({ habit }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteHabit(habit._id));
  };

  const handleToggle = () => {
    dispatch(toggleHabit(habit._id));
  };

  const isCompletedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.records.some(record => {
      const recordDate = new Date(record);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });
  };

  const cardClass = `${styles.habitCard} ${habit.type === 'good' ? styles.goodHabitCard : styles.badHabitCard}`;

  return (
    <div className={cardClass}>
      <h3>{habit.name}</h3>
      <div className="flex-group">
        <button onClick={handleToggle} className={isCompletedToday() ? 'btn-undo' : 'btn-complete'}>
          {isCompletedToday() ? 'Undo' : 'Complete'}
        </button>
        <button onClick={handleDelete} className="btn-delete">Delete</button>
      </div>
    </div>
  );
};

export default Habit;
