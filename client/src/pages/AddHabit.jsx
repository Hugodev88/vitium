import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createHabit } from '../store/habitsSlice';
import styles from './AddHabit.module.css';

const AddHabit = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('good');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.habits);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createHabit({ name, type }));
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.addHabitContainer}>
      <h2>Add New Habit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Habit Name</label>
          <input
            type="text"
            id="name"
            placeholder="e.g., Drink 8 glasses of water"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Habit Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="good">Good Habit</option>
            <option value="bad">Bad Habit</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Habit'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddHabit;
