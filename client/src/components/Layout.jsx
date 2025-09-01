import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav>
        <div className="navbar-content">
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
                <li>
                  <Link to="/challenges">Challenges</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </li>
              </>
            )}
            {!isAuthenticated && (
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
