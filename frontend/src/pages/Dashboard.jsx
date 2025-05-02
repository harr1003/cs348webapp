import "../styles/notes.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <h2 className="nav">&#8593; Use this menu to navigate Storytime</h2>
      <div className="center">
        <h1>Need some help with Storytime?</h1>
        <h3>Here are some written tutorials to get you started!</h3>

        <button
          className="buttons"
          onClick={() => navigate("/Storytime/CharacterTutorial")}
        >
          How to make a Character
        </button>
        <button
          className="buttons"
          onClick={() => navigate("/Storytime/NoteTutorial")}
        >
          Using Notes
        </button>
        <button
          className="buttons"
          onClick={() => navigate("/Storytime/EventTutorial")}
        >
          How to create an Event
        </button>
      </div>
    </>
  );
};
export default Dashboard;
