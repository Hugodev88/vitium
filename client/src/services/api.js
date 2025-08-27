import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch(logout());
      // Optionally, redirect to login page here. 
      // For React Router v6, this usually happens in a component.
    }
    return Promise.reject(err);
  }
);

export default api;
