import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import "../styles/navbar.css"; // Ensure you have styling

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(user);

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  // Helper function to check if a link is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && <span className="welcome">Hello, {user.username}!</span>}
      </div>
      <div className="navbar-right">
        <ul>
          <li>
            <Link to="/Dashboard" className={isActive("/Dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Characters" className={isActive("/Characters")}>
              Characters
            </Link>
          </li>
          <li>
            <Link to="/Notes" className={isActive("/Notes")}>
              Notes
            </Link>
          </li>
          <li>
            <Link to="/Events" className={isActive("/Events")}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/Profile" className={isActive("/Profile")}>
              Profile
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
