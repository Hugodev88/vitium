import React, { useState } from 'react';
import Habit from './Habit';
import styles from './HabitList.module.css';

const HabitList = ({ habits }) => {
  const [activeTab, setActiveTab] = useState('all');

  const goodHabits = habits?.filter(habit => habit.type === 'good') || [];
  const badHabits = habits?.filter(habit => habit.type === 'bad') || [];
  const totalHabits = habits?.length || 0;

  const getVisibleHabits = () => {
    switch (activeTab) {
      case 'good':
        return goodHabits;
      case 'bad':
        return badHabits;
      default:
        return habits || [];
    }
  };

  const visibleHabits = getVisibleHabits();

  return (
    <div className={styles.habitListContainer}>
      {/* Header com Tabs */}
      <div className={styles.header}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span className={styles.tabIcon}>📋</span>
            <span className={styles.tabText}>Todos</span>
            <span className={styles.tabBadge}>{totalHabits}</span>
          </button>

          <button
            className={`${styles.tab} ${activeTab === 'good' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('good')}
          >
            <span className={styles.tabIcon}>✅</span>
            <span className={styles.tabText}>Bons Hábitos</span>
            <span className={styles.tabBadge + ' ' + styles.goodBadge}>{goodHabits.length}</span>
          </button>

          <button
            className={`${styles.tab} ${activeTab === 'bad' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('bad')}
          >
            <span className={styles.tabIcon}>🚫</span>
            <span className={styles.tabText}>Hábitos a Evitar</span>
            <span className={styles.tabBadge + ' ' + styles.badBadge}>{badHabits.length}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {totalHabits === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3>Nenhum hábito ainda</h3>
            <p>Comece criando seus primeiros hábitos para começar sua jornada de transformação!</p>
          </div>
        ) : visibleHabits.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {activeTab === 'good' ? '✨' : activeTab === 'bad' ? '🛡️' : '📝'}
            </div>
            <h3>
              {activeTab === 'good' ? 'Nenhum bom hábito ainda' :
                activeTab === 'bad' ? 'Nenhum hábito ruim ainda' :
                  'Nenhum hábito encontrado'}
            </h3>
            <p>
              {activeTab === 'good' ? 'Adicione hábitos positivos que deseja cultivar!' :
                activeTab === 'bad' ? 'Adicione hábitos que deseja evitar!' :
                  'Adicione alguns hábitos para começar!'}
            </p>
          </div>
        ) : (
          <>
            {/* View Mode Toggle */}
            <div className={styles.viewControls}>
              <div className={styles.filterInfo}>
                <span className={styles.resultCount}>
                  {visibleHabits.length} {visibleHabits.length === 1 ? 'hábito' : 'hábitos'}
                  {activeTab !== 'all' && (
                    <span className={styles.filterType}>
                      · {activeTab === 'good' ? 'Bons' : 'Para Evitar'}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Habits Grid */}
            <div className={styles.habitsGrid}>
              {visibleHabits.map(habit => (
                <div
                  key={habit._id}
                  className={`${styles.habitWrapper} ${habit.type === 'good' ? styles.goodHabit : styles.badHabit
                    }`}
                >
                  <Habit habit={habit} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary Footer (quando há hábitos) */}
      {totalHabits > 0 && (
        <div className={styles.summary}>
          <div className={styles.summaryStats}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}>📊</span>
              <span className={styles.summaryText}>
                <strong>{totalHabits}</strong> hábitos totais
              </span>
            </div>

            {goodHabits.length > 0 && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryIcon}>💚</span>
                <span className={styles.summaryText}>
                  <strong>{goodHabits.length}</strong> para cultivar
                </span>
              </div>
            )}

            {badHabits.length > 0 && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryIcon}>🛡️</span>
                <span className={styles.summaryText}>
                  <strong>{badHabits.length}</strong> para evitar
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
    
  );
};

export default HabitList;