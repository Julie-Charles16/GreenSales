import { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    <form
  onSubmit={handleSubmit}
  className="d-flex justify-content-center align-items-center vh-100 bg-light"
>
  <div
    className="bg-white p-4 rounded-4 shadow-sm border"
    style={{ maxWidth: "400px", width: "100%" }}
  >
    <h2 className="text-center mb-4 fw-bold">Inscription</h2>

    <input
      placeholder="Pseudo"
      className="form-control mb-3"
      onChange={(e) => setPseudo(e.target.value)}
    />

    <input
      type="email"
      placeholder="Email"
      className="form-control mb-3"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Mot de passe"
      className="form-control mb-4"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button type="submit" className="btn btn-dark w-100 rounded-pill py-2">
      S'inscrire
    </button>

    <p className="text-center text-muted mt-3 mb-0">
      Déjà un compte ?{" "}
      <Link to="/login" className="text-decoration-none">
        Se connecter
      </Link>
    </p>
  </div>
</form>
  );
}