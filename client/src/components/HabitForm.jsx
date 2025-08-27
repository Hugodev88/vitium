import { useState } from 'react';
import axios from 'axios';

const HabitForm = ({ setHabits }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('good');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/v1/habits', { name, description, type });
      setHabits(prevHabits => [...prevHabits, data.habit]);
      setName('');
      setDescription('');
      setType('good');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="good">Good</option>
        <option value="bad">Bad</option>
      </select>
      <button type="submit">Add Habit</button>
    </form>
  );
};

export default HabitForm;
