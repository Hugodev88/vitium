import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../services/api'; // Assumindo que api.js exporta uma instância do axios configurada
import { toast } from 'react-toastify';

const ChallengeProgression = ({ challengeId, challengeName }) => {
    // Obter o usuário logado do estado Redux para autenticação
    const { user } = useSelector((state) => state.auth);

    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [badgeEarned, setBadgeEarned] = useState(false); // Para controlar a notificação da insígnia

    const requiredDays = 30; // Número de dias para completar o desafio (deve ser consistente com o backend)

    // Efeito para buscar o progresso do desafio quando o componente é montado ou challengeId/user muda
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user || !challengeId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null); // Limpar erros anteriores
                const response = await axios.get(`/user-challenges/${challengeId}/progress`);
                setProgress(response.data.progress);
                setIsCompleted(response.data.isCompleted);
                setLoading(false);
            } catch (err) {
                setError('Falha ao carregar o progresso do desafio.');
                setLoading(false);
                console.error('Erro ao buscar progresso:', err);
            }
        };

        fetchProgress();
    }, [user, challengeId]); // Dependências: user e challengeId

    // Função para marcar o dia como completo
    const handleMarkDayComplete = async () => {
        if (!user || !challengeId || isCompleted) {
            return; // Não faz nada se não houver usuário, challengeId ou se já estiver completo
        }
        try {
            setLoading(true);
            setError(null); // Limpar erros anteriores
            const response = await axios.post(`/user-challenges/${challengeId}/complete`);

            // Atualiza o estado com o novo progresso
            setProgress(response.data.userChallenge.progress.length);

            // Verifica se o desafio foi completado AGORA e se não estava completo antes
            if (response.data.userChallenge.isCompleted && !isCompleted) {
                setIsCompleted(true); // Marca como completo
                setBadgeEarned(true); // Ativa a notificação de insígnia
                toast.success(`Parabéns! Você completou o desafio "${challengeName}" e ganhou a insígnia "${challengeName} Master"!`);
            } else if (response.data.msg) {
                // Mensagem do backend, por exemplo, "Day already marked as complete for today."
                toast.info(response.data.msg);
            }
            setLoading(false);
        } catch (err) {
            setError('Falha ao marcar o dia como completo.');
            setLoading(false);
            console.error('Erro ao marcar dia:', err);
            // Se o erro for que o dia já foi marcado, o backend já envia a msg.
            // Para outros erros, pode-se exibir uma mensagem genérica.
            if (err.response && err.response.data && err.response.data.msg) {
                toast.error(err.response.data.msg);
            }
        }
    };

    if (loading) return <p>Carregando progresso do desafio...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3>Progresso do Desafio: {challengeName}</h3>
            <p>Dias Completos: <span style={{ fontWeight: 'bold' }}>{progress}</span> / {requiredDays}</p>

            {isCompleted ? (
                <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.1em' }}>🎉 Desafio Concluído! 🎉</p>
            ) : (
                <button
                    onClick={handleMarkDayComplete}
                    disabled={loading || isCompleted}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745', // Cor verde para "marcar"
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        opacity: loading || isCompleted ? 0.6 : 1,
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    {loading ? 'Marcando...' : 'Marcar Dia Como Completo'}
                </button>
            )}

            {badgeEarned && (
                <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '5px',
                    border: '1px solid #c3e6cb',
                    fontWeight: 'bold'
                }}>
                    🎉 Nova Insígnia Conquistada! 🎉
                    <p>Você é agora um "{challengeName} Master"!</p>
                </div>
            )}

            {/* Opcional: Exibir as insígnias do usuário.
                Isso geralmente seria feito em uma página de perfil,
                mas pode ser útil para depuração aqui.
                Você precisaria garantir que o `user` no Redux seja atualizado
                após ganhar uma insígnia (talvez recarregando o perfil do usuário
                ou despachando uma ação Redux para adicionar a insígnia).
            */}
            {/*
            {user && user.badges && user.badges.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px dashed #eee' }}>
                    <h4>Suas Insígnias:</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {user.badges.map((badge, index) => (
                            <li key={index} style={{
                                background: '#e9ecef',
                                margin: '5px 0',
                                padding: '8px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                marginRight: '10px'
                            }}>{badge}</li>
                        ))}
                    </ul>
                </div>
            )}
            */}
        </div>
    );
};

export default ChallengeProgression;