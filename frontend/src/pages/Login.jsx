import { useState } from "react";
import "../styles/notes.css";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(identifier, password);
    console.log(response);
    if (response && !response.error) {
      navigate("/Storytime/Dashboard");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/Storytime/Signup");
  };

  return (
    <div className="center">
      <div className="welcome">Login to Storytime</div>
      <div className="loginContainer">
        <form className="loginForm" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            Login
          </button>
          <button onClick={handleSignup} className="buttons">
            Sign Up Instead
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
