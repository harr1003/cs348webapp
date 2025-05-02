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
    navigate("/Storytime/Login");
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
            <Link
              to="/Storytime/Dashboard"
              className={isActive("/Storytime/Dashboard")}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/Storytime/Characters"
              className={isActive("/Storytime/Characters")}
            >
              Characters
            </Link>
          </li>
          <li>
            <Link
              to="/Storytime/Notes"
              className={isActive("/Storytime/Notes")}
            >
              Notes
            </Link>
          </li>
          <li>
            <Link
              to="/Storytime/Events"
              className={isActive("/Storytime/Events")}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/Storytime/Profile"
              className={isActive("/Storytime/Profile")}
            >
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
