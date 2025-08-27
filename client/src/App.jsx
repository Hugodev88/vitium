import { useState, useEffect } from 'react';
import axios from 'axios';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';

function App() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/v1/habits');
        setHabits(data.habits);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHabits();
  }, []);

  return (
    <div>
      <h1>Habit Tracker</h1>
      <HabitForm setHabits={setHabits} />
      <HabitList habits={habits} setHabits={setHabits} />
    </div>
  );
}

export default App;