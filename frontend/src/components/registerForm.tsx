import { useState } from "react";
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/toast/useToast";
// import axios from "axios";

export default function Register() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 🔴 VALIDATION FRONT
  if (!pseudo.trim() || !email.trim() || !password.trim()) {
    showToast({
      message: "Tous les champs sont obligatoires",
      variant: "danger",
    });
    return;
  }

  try {
    await api.post("/auth/register", {
      pseudo,
      email,
      password,
    });

    showToast({
      message: "Compte créé avec succès !",
      variant: "success",
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const err = error as {
        response?: { data?: { message?: string } };
      };

      showToast({
        message:
          err.response?.data?.message ||
          "Erreur lors de l'inscription",
        variant: "danger",
      });
    } else {
      showToast({
        message: "Erreur lors de l'inscription",
        variant: "danger",
      });
    }
  }
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
  required
  onChange={(e) => setPseudo(e.target.value)}
/>

        <input
  type="email"
  placeholder="Email"
  className="form-control mb-3"
  required
  onChange={(e) => setEmail(e.target.value)}
/>

        <div className="input-group mb-4">
          <input
  type={showPassword ? "text" : "password"}
  placeholder="Mot de passe"
  className="form-control"
  required
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

        <button type="submit" className="btn btn-dark w-100 rounded-pill py-2">
          S'inscrire
        </button>

        <p className="text-center text-muted mt-3 mb-0">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </form>
  );
}