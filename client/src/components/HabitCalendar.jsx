import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import styles from './HabitCalendar.module.css';

const HabitCalendar = ({ habits }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1)

  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);
  yearAgo.setHours(0, 0, 0, 0);

  const dailyCounts = {};

  // Processa hábitos
  habits?.forEach(habit => {
    habit.records?.forEach(recordDate => {
      const date = new Date(recordDate);
      date.setHours(0, 0, 0, 0);
      if (date > tomorrow) return;
      const dateString = date.toISOString().slice(0, 10);
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    });
  });

  // Gera todos os dias do ano até amanhã (inclusive)
  const allDates = [];
  let currentDate = new Date(yearAgo);
  while (currentDate <= tomorrow) {
    currentDate.setHours(0, 0, 0, 0);
    const dateString = currentDate.toISOString().slice(0, 10);
    allDates.push({
      date: dateString,
      count: dailyCounts[dateString] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalDays = Object.values(dailyCounts).filter(c => c > 0).length;
  const maxCount = Math.max(...Object.values(dailyCounts), 0);
  const totalHabits = Object.values(dailyCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.calendarContainer}>
      {/* Header */}
      <div className={styles.calendarHeader}>
        <div className={styles.titleSection}>
          <h3 className={styles.calendarTitle}>Mapa de Atividades</h3>
          <p className={styles.calendarSubtitle}>Visualize sua consistência ao longo do ano</p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalDays}</span>
            <span className={styles.statLabel}>dias ativos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalHabits}</span>
            <span className={styles.statLabel}>hábitos completos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{maxCount}</span>
            <span className={styles.statLabel}>melhor dia</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className={styles.heatmapWrapper}>
        <CalendarHeatmap
          startDate={yearAgo}
          endDate={today} // garante que amanhã seja o último
          values={allDates}
          classForValue={(value) => {
            if (!value) return styles.colorEmpty;

            const valueDate = new Date(value.date);
            valueDate.setHours(0, 0, 0, 0);

            const intensity = Math.min(Math.ceil((value.count / Math.max(maxCount, 1)) * 4), 4);
            const classes = [styles[`colorScale${intensity}`]];

            // Destaca apenas o dia de hoje com borda diferente
            if (valueDate.getTime() === yesterday.getTime()) {
              classes.push(styles.todayHighlightStrong);
            }

            // Não aplicar borda no dia de amanhã
            return classes.join(' ');
          }}
          tooltipDataAttrs={(value) => ({
            'data-tooltip-id': 'habit-tooltip',
            'data-tooltip-html': `<div>
      <p><strong>Data:</strong> ${value.date}</p>
      <p><strong>Hábitos completados:</strong> ${value.count}</p>
    </div>`,
          })}
          showWeekdayLabels={true}
          weekdayLabels={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']}
          rectProps={{ rx: 3, ry: 3 }}
        />
        <Tooltip id="habit-tooltip" html place="top" effect="solid" className={styles.customTooltip} />
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Menos</span>
        <div className={styles.legendScale}>
          <div className={`${styles.legendSquare} ${styles.colorEmpty}`}></div>
          <div className={`${styles.legendSquare} ${styles.colorScale1}`}></div>
          <div className={`${styles.legendSquare} ${styles.colorScale2}`}></div>
          <div className={`${styles.legendSquare} ${styles.colorScale3}`}></div>
          <div className={`${styles.legendSquare} ${styles.colorScale4}`}></div>
        </div>
        <span className={styles.legendLabel}>Mais</span>
      </div>

      {/* Empty State */}
      {totalDays === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h4>Nenhuma atividade ainda</h4>
          <p>Complete seus hábitos para ver sua evolução no calendário!</p>
        </div>
      )}
    </div>
  );
};

export default HabitCalendar;
