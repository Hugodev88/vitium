import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setName, setType, resetForm, createHabit } from '../store/habitFormSlice';
import { toast } from 'react-toastify';
import styles from './AddHabit.module.css';

const AddHabit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, type, loading, error, success } = useSelector(state => state.habitForm);

  useEffect(() => {
    if (success) {
      toast.success('Hábito adicionado com sucesso!');
      dispatch(resetForm());
      navigate('/dashboard');
    }
    if (error) {
      toast.error(`Erro ao adicionar hábito: ${error}`);
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createHabit({ name, type }));
  };

  return (
    <div className={styles.addHabitContainer}>
      <h2>Adicionar Novo Hábito</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Hábito</label>
          <input
            type="text"
            id="name"
            placeholder="Ex: Beber 8 copos de água"
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Tipo de Hábito</label>
          <select id="type" value={type} onChange={(e) => dispatch(setType(e.target.value))}>
            <option value="good">Hábito Bom</option>
            <option value="bad">Hábito Ruim</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Hábito'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddHabit;
