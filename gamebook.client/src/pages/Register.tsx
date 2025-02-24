import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiBaseUrl } from "../EnvFile";
import { useGameContext } from "../GameProvider";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const { saveUserData } = useGameContext();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    saveUserData();
    try {
      const response = await fetch(`${ApiBaseUrl}/api/User/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      navigate("/login");
    } catch (error) {
      setError((error as any).message);
    }
  };

  return (
    <div >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p >{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
