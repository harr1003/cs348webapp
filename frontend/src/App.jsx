import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Characters from "./pages/Characters";
import Notes from "./pages/Notes";
import Events from "./pages/Events";
import Navbar from "./components/Navbar";
import CharTutorial from "./pages/CharTutorial";
import EventTutorial from "./pages/EventTutorial";
import NoteTutorial from "./pages/NoteTutorial";
import Profile from "./pages/Profile";

import "./styles/app.css";
import Home from "./pages/Home";

function App() {
  const location = useLocation();

  const showNavbar = [
    "/Dashboard",
    "/Characters",
    "/Notes",
    "/Events",
    "/CharacterTutorial",
    "/NoteTutorial",
    "/EventTutorial",
    "/Profile",
  ].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Characters" element={<Characters />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/CharacterTutorial" element={<CharTutorial />} />
        <Route path="/EventTutorial" element={<EventTutorial />} />
        <Route path="/NoteTutorial" element={<NoteTutorial />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
