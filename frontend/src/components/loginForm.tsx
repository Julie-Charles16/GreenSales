import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import api from "../api/client";
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    login(res.data.token, res.data.user);

    navigate("/dashboard");

  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || "Erreur serveur");
  } else {
    setError("Erreur inconnue");
  }
  } finally {
    setLoading(false);
  }
};


  return (
    <form
  onSubmit={handleLogin}
  className="d-flex justify-content-center align-items-center vh-100 bg-light"
>
  <div
    className="bg-white p-4 rounded-4 shadow-sm border"
    style={{ maxWidth: "400px", width: "100%" }}
  >
    <h2 className="text-center mb-4 fw-bold">Connexion</h2>

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

    {error && <p className="text-danger">{error}</p>}

    <button disabled={loading} className="btn btn-dark w-100 rounded-pill py-2">
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Connexion...
        </>
      ) : (
        "Se connecter"
      )}
    </button>

    <p className="text-center text-muted mt-3 mb-0">
      Pas encore de compte ?{" "}
      <Link to="/register" className="text-decoration-none">
        S'inscrire
      </Link>
    </p>
  </div>
</form>
  );
}