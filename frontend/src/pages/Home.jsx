import "../styles/notes.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="center">
      <h1>Welcome to Storytime!</h1>
      <button className="buttons" onClick={() => navigate("/Login")}>
        Log In
      </button>
      <button className="buttons" onClick={() => navigate("/SignUp")}>
        Sign Up
      </button>
    </div>
  );
};
export default Home;
