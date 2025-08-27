import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip'; // Import Tooltip

const HabitCalendar = ({ habits }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const yearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const dailyCounts = {};

  habits.forEach(habit => {
    habit.records.forEach(recordDate => {
      const date = new Date(recordDate);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().slice(0, 10);
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    });
  });

  const values = Object.keys(dailyCounts).map(dateString => ({
    date: dateString,
    count: dailyCounts[dateString],
  }));

  return (
    <div className="calendar-container">
      <h3>Habit Completion Heatmap</h3>
      <div className="heatmap-wrapper"> {/* New wrapper div */}
        <CalendarHeatmap
          startDate={yearAgo}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            const date = new Date(value.date);
            date.setHours(0, 0, 0, 0);
            const classes = [`color-scale-${Math.min(value.count, 4)}`];
            if (date.getTime() === today.getTime()) {
              classes.push('today-highlight');
            }
            return classes.join(' ');
          }}
          tooltipDataAttrs={(value) => {
            return {
              'data-tooltip-id': 'habit-tooltip',
              'data-tooltip-content': `${value.date}: ${value.count} habit${value.count === 1 ? '' : 's'} completed`,
            };
          }}
          showWeekdayLabels={true}
          rectProps={{
            rx: 3, // Apply border-radius to rects
            ry: 3,
          }}
        />
        <Tooltip id="habit-tooltip" /> {/* Add the Tooltip component */}
      </div>
    </div>
  );
};

export default HabitCalendar;
