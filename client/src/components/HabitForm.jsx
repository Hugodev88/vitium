import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setName, setDescription, setType, resetForm, createHabit } from '../store/habitFormSlice';
import { toast } from 'react-toastify';

const HabitForm = () => {
  const dispatch = useDispatch();
  const { name, description, type, loading, error, success } = useSelector(state => state.habitForm);

  useEffect(() => {
    if (success) {
      toast.success('Hábito criado com sucesso!');
      dispatch(resetForm());
      // Optionally, dispatch an action to refresh the habits list in habitsSlice
      // e.g., dispatch(fetchHabits()); if you have such an action
    }
    if (error) {
      toast.error(`Erro ao criar hábito: ${error}`);
    }
  }, [success, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createHabit({ name, description, type }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do Hábito"
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => dispatch(setDescription(e.target.value))}
      />
      <select value={type} onChange={(e) => dispatch(setType(e.target.value))}>
        <option value="good">Bom</option>
        <option value="bad">Ruim</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Hábito'}
      </button>
    </form>
  );
};

export default HabitForm;
