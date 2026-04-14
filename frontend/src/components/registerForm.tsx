import { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post('/auth/register', {
      pseudo,
      email,
      password,
    });

    alert('Compte créé !');
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Pseudo" onChange={(e) => setPseudo(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Register</button>
    </form>
  );
}