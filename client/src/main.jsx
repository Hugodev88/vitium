import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { setAuthToken } from './services/api';
import { loadUser } from './store/authSlice'; // Only loadUser, setAuthStatus is not needed here anymore
import { ToastContainer } from 'react-toastify';

import './index.css';
import './App.css';
import './styles/layout.css';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddHabit from './pages/AddHabit.jsx';
import Progress from './pages/Progress.jsx';
import Streaks from './pages/Streaks.jsx';
import Profile from './pages/Profile.jsx';
import Challenges from './pages/Challenges.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';

// Set auth token on initial load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
  store.dispatch(loadUser());
} else {
  // If no token, loadUser will handle setting isAuthenticated to false
  // No need to dispatch setAuthStatus(false) here explicitly
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: 'login', element: <Login /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'add-habit', element: <AddHabit /> },
          { path: 'progress', element: <Progress /> },
          { path: 'streaks', element: <Streaks /> },
          { path: 'challenges', element: <Challenges /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  </StrictMode>
);
