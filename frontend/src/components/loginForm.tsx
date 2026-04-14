import { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Login({ setToken }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await api.post("/auth/login", {
    email,
    password,
  });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.data.token); // 🔥 maintenant OK

    navigate("/dashboard");
};


  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Login</button>
    </form>
  );
}