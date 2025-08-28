import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Challenges.module.css';

const Challenges = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChallenges = async () => {
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

      const response = await axios.get('/api/v1/challenges', config);
      setChallenges(response.data?.challenges || []);
    } catch (err) {
      console.error('Erro ao buscar desafios:', err);
      setError('Não foi possível carregar os desafios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const handleJoinLeave = async (challengeId, action) => {
    if (!user || !token) {
      toast.error('Faça login para participar dos desafios.');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const endpoint = `/api/v1/challenges/${challengeId}/${action}`;
      await axios.post(endpoint, {}, config);

      toast.success(
        `Você ${action === 'join' ? 'entrou no' : 'saiu do'} desafio com sucesso!`
      );

      fetchChallenges(); // Atualiza a lista após entrar/sair
    } catch (err) {
      console.error(`Erro ao ${action === 'join' ? 'entrar no' : 'sair do'} desafio:`, err);
      toast.error(`Não foi possível ${action === 'join' ? 'entrar no' : 'sair do'} desafio.`);
    }
  };

  if (loading) {
    return <div className={styles.container}>Carregando desafios...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Desafios Disponíveis</h2>
      <div className={styles.grid}>
        {challenges.length === 0 ? (
          <p>Nenhum desafio disponível no momento. Volte mais tarde!</p>
        ) : (
          challenges.map((challenge) => {
            const isParticipant = challenge.participants?.some(
              (p) => p.userId === user?._id || p.userId === user?.id
            );

            const startDate = challenge.startDate
              ? new Date(challenge.startDate).toLocaleDateString()
              : 'Data não definida';
            const endDate = challenge.endDate
              ? new Date(challenge.endDate).toLocaleDateString()
              : 'Data não definida';

            return (
              <div key={challenge._id} className={styles.card}>
                <h3 className={styles.cardTitle}>{challenge.name || 'Sem título'}</h3>
                <p className={styles.description}>
                  {challenge.description || 'Sem descrição disponível.'}
                </p>
                <p className={styles.dates}>
                  Período: {startDate} - {endDate}
                </p>

                <p className={styles.participants}>
                  Participantes: {challenge.participants?.length ?? 0}
                </p>

                <div className={styles.actions}>
                  {isParticipant ? (
                    <button
                      className={`${styles.button} ${styles.leaveButton}`}
                      onClick={() => handleJoinLeave(challenge._id, 'leave')}
                    >
                      Sair do Desafio
                    </button>
                  ) : (
                    <button
                      className={`${styles.button} ${styles.joinButton}`}
                      onClick={() => handleJoinLeave(challenge._id, 'join')}
                    >
                      Entrar no Desafio
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Challenges;
