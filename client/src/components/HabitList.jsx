import Habit from './Habit';

const HabitList = ({ habits }) => {
  const goodHabits = habits.filter(habit => habit.type === 'good');
  const badHabits = habits.filter(habit => habit.type === 'bad');

  return (
    <div className="habit-list-container">
      <div className="habit-section">
        <h3>Good Habits</h3>
        {goodHabits.length === 0 ? (
          <p>No good habits yet. Add one!</p>
        ) : (
          goodHabits.map(habit => (
            <Habit key={habit._id} habit={habit} />
          ))
        )}
      </div>
      <div className="habit-section">
        <h3>Bad Habits</h3>
        {badHabits.length === 0 ? (
          <p>No bad habits yet. Add one!</p>
        ) : (
          badHabits.map(habit => (
            <Habit key={habit._id} habit={habit} />
          ))
        )}
      </div>
    </div>
  );
};

export default HabitList;
