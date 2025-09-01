import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Challenges.module.css';

const Challenges = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  const [challenges, setChallenges] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission

  const fetchChallengesAndHabits = useCallback(async () => {
    if (!user || !token) {
      setError('Você precisa estar logado para ver os desafios.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [challengesRes, habitsRes] = await Promise.all([
        axios.get('/api/v1/challenges', config),
        axios.get('/api/v1/habits', config),
      ]);

      const allChallenges = challengesRes.data?.challenges || [];
      const currentDate = new Date();
      const currentMonthChallenge = allChallenges.find(c => {
        const startDate = new Date(c.startDate);
        const endDate = new Date(c.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      });

      setChallenges(currentMonthChallenge ? [currentMonthChallenge] : []);
      setHabits(habitsRes.data?.habits || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchChallengesAndHabits();
  }, [fetchChallengesAndHabits]);

  const handleJoinLeave = useCallback(async (challengeId, action) => {
    if (!user || !token) {
      toast.error('Faça login para participar dos desafios.');
      return;
    }

    // Get the current challenge from the state to check participation status
    const currentChallenge = challenges.find(c => c._id === challengeId);
    const isAlreadyParticipant = currentChallenge?.participants?.some(p => p.userId?._id === user?._id);

    if (action === 'join' && isAlreadyParticipant) {
      toast.info('Você já está participando deste desafio!');
      return;
    }

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true); // Set submitting to true

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const endpoint = `/api/v1/challenges/${challengeId}/${action}`;
      const response = await axios.post(endpoint, {}, config);

      if (action === 'join' && response.data.msg === 'Already joined this challenge') {
        toast.info('Você já está participando deste desafio!');
      } else {
        toast.success(
          `Você ${action === 'join' ? 'entrou no' : 'saiu do'} desafio com sucesso!`
        );
      }

      fetchChallengesAndHabits();
    } catch (err) {
      console.error(`Erro ao ${action === 'join' ? 'entrar no' : 'sair do'} desafio:`, err);
      toast.error(`Não foi possível ${action === 'join' ? 'entrar no' : 'sair do'} desafio.`);
    } finally {
      setIsSubmitting(false); // Set submitting to false in finally block
    }
  }, [user, token, isSubmitting, fetchChallengesAndHabits, challenges]);

  const openModal = (challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedChallenge(null);
  };

  const renderChallengeCard = (challenge) => {
    const isParticipant = challenge.participants?.some(
      (p) => p.userId?._id === user?._id
    );

    const startDate = new Date(challenge.startDate).toLocaleDateString();
    const endDate = new Date(challenge.endDate).toLocaleDateString();

    const relatedHabit = habits.find(
      (h) => h.name === challenge.rules?.habitName
    );
    const currentStreak = relatedHabit?.currentStreak ?? 0;
    const goalStreak = challenge.rules?.value ?? 0;
    const progress = goalStreak > 0 ? (currentStreak / goalStreak) * 100 : 0;

    return (
      <div key={challenge._id} className={styles.card}>
        <h3 className={styles.cardTitle}>{challenge.name}</h3>
        <p className={styles.description}>{challenge.description}</p>
        <p className={styles.dates}>
          Período: {startDate} - {endDate}
        </p>

        {isParticipant && challenge.rules?.type === 'streak' && (
          <div className={styles.progressContainer}>
            <p>Seu Progresso: {currentStreak} / {goalStreak} dias</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <p
          className={styles.participants}
          onClick={() => openModal(challenge)}
        >
          Participantes: {challenge.participants?.length ?? 0}
        </p>

        <div className={styles.actions}>
          {isParticipant ? (
            <button
              className={`${styles.button} ${styles.leaveButton}`}
              onClick={() => handleJoinLeave(challenge._id, 'leave')}
              disabled={isSubmitting} // Disable button during submission
            >
              {isSubmitting ? 'Processando...' : 'Sair do Desafio'}
            </button>
          ) : (
            <button
              className={`${styles.button} ${styles.joinButton}`}
              onClick={() => handleJoinLeave(challenge._id, 'join')}
              disabled={isSubmitting} // Disable button during submission
            >
              {isSubmitting ? 'Processando...' : 'Entrar no Desafio'}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className={styles.container}>Carregando desafios...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        {console.error(error)}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Desafio do Mês</h2>
      <div className={styles.grid}>
        {challenges.length === 0 ? (
          <p>Nenhum desafio disponível no momento. Volte mais tarde!</p>
        ) : (
          challenges.map((challenge) => renderChallengeCard(challenge))
        )}
      </div>

      {showModal && selectedChallenge && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              Participantes de "{selectedChallenge.name}"
            </h3>
            <ul className={styles.participantList}>
              {selectedChallenge.participants.map((p) => (
                <li key={p.userId?._id}>{p.userId?.name || 'Usuário anônimo'}</li>
              ))}
            </ul>
            <button className={styles.modalCloseButton} onClick={closeModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
