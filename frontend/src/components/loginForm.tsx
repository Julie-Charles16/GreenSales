import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/useToast";
import api from "../api/client";
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);

      showToast({
        message: "Connexion réussie !",
        variant: "success",
      });

      setRedirecting(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showToast({
          message: error.response?.data?.message || "Identifiants invalides",
          variant: "danger",
        });
      } else {
        showToast({
          message: "Erreur inconnue",
          variant: "danger",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
    >
      <div className="bg-white p-4 rounded-4 shadow-sm border" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold">Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="input-group mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
          </button>
        </div>

        <button
          type="submit"
          disabled={redirecting}
          className="btn btn-dark w-100 rounded-pill py-2"
        >
          {redirecting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Redirection...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        <p className="text-center text-muted mt-3 mb-0">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </form>
  );
}