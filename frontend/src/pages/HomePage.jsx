import { useState } from "react";
import "../styles/notes.css";

const HomePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="background">
      <div className="welcome"></div>
      <div className="homeContainer">
        <div className="noteOutline">
          <div
            className={`newNote ${isExpanded ? "expanded" : ""}`}
            onClick={handleExpand}
          >
            {isExpanded ? (
              <textarea
                className="noteInput"
                placeholder="Write note here..."
                onClick={(e) => e.stopPropagation()}
              ></textarea>
            ) : (
              "New Note"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
