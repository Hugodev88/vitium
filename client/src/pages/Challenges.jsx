import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallenges } from '../store/challengesSlice';
import ChallengeProgression from '../components/ChallengeProgression';

const Challenges = () => {
    const dispatch = useDispatch();
    const { challenges, seasonalChallenge, loading, error } = useSelector(state => state.challenges);

    useEffect(() => {
        dispatch(fetchChallenges());
    }, [dispatch]);

    if (loading) return <p>Carregando desafios...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    return (
        <div>
            <h1>Meus Desafios</h1>

            {seasonalChallenge && (
                <div style={{ 
                    border: '2px solid #007bff', 
                    padding: '20px', 
                    margin: '20px 0', 
                    borderRadius: '10px', 
                    backgroundColor: '#e7f3ff' 
                }}>
                    <h2>Desafio Sazonal Ativo: {seasonalChallenge.name}</h2>
                    <p><strong>Descrição:</strong> {seasonalChallenge.description}</p>
                    <p><strong>Período:</strong> {new Date(seasonalChallenge.startDate).toLocaleDateString()} - {new Date(seasonalChallenge.endDate).toLocaleDateString()}</p>
                    {/* Você pode adicionar mais detalhes do desafio sazonal aqui */}
                </div>
            )}

            {!seasonalChallenge && challenges.length > 0 && (
                <p style={{ margin: '20px 0', padding: '10px', border: '1px solid #ffc107', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                    Não há um desafio sazonal ativo no momento.
                </p>
            )}

            {challenges.length === 0 ? (
                <p>Nenhum desafio disponível no momento.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {challenges.map((challenge) => (
                        <ChallengeProgression
                            key={challenge._id} // É crucial ter uma key única ao mapear componentes
                            challengeId={challenge._id}
                            challengeName={challenge.name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Challenges;