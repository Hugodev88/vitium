import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useState } from 'react';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <nav>
        <div className="container navbar-content">
          <Link to="/" className="navbar-brand">
            Vitium
          </Link>
          <ul className="navbar-nav">
            {!isAuthenticated && (
              <li>
                <Link to="/">Home</Link>
              </li>
            )}
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/progress">Progress</Link>
                </li>
                <li>
                  <Link to="/streaks">Streaks</Link>
                </li>
              </>
            )}
            {isAuthenticated ? (
              <li className="user-menu-container">
                <button onClick={toggleUserMenu} className="user-email-btn">
                  {user ? user.name : 'User'}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)}>Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
