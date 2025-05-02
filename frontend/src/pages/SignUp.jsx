import { useState } from "react";
import "../styles/notes.css";
import { useSignup } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(username, email, password);
    navigate("/Storytime/Dashboard");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/Storytime/Login");
  };

  return (
    <div className="center">
      <div className="welcome">Sign Up for Storytime</div>
      <div className="loginContainer">
        <form className="loginForm" onSubmit={handleSignup}>
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="inputField"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inputField"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="inputField"
          />
          <button disabled={isLoading} type="submit" className="buttons">
            Sign Up
          </button>
          <button onClick={handleLogin} className="buttons">
            Login Instead
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};
export default SignUp;
