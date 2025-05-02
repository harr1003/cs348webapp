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
    "/Storytime/Dashboard",
    "/Storytime/Characters",
    "/Storytime/Notes",
    "/Storytime/Events",
    "/Storytime/CharacterTutorial",
    "/Storytime/NoteTutorial",
    "/Storytime/EventTutorial",
    "/Storytime/Profile",
  ].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/Storytime" element={<Home />} />
        <Route path="/Storytime/Login" element={<Login />} />
        <Route path="/Storytime/SignUp" element={<SignUp />} />
        <Route path="/Storytime/Dashboard" element={<Dashboard />} />
        <Route path="/Storytime/Characters" element={<Characters />} />
        <Route path="/Storytime/Notes" element={<Notes />} />
        <Route path="/Storytime/Events" element={<Events />} />
        <Route path="/Storytime/CharacterTutorial" element={<CharTutorial />} />
        <Route path="/Storytime/EventTutorial" element={<EventTutorial />} />
        <Route path="/Storytime/NoteTutorial" element={<NoteTutorial />} />
        <Route path="/Storytime/Profile" element={<Profile />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
