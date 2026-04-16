import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      
      <h1 className="display-3 fw-bold mb-3">        
        <i className="bi bi-leaf-fill me-2"></i>
        GreenSales</h1>
      
      <p className="lead mb-4">
        Votre CRM pour la gestion de votre activité commerciale.
      </p>

      <Link to="/login" className="mb-3">
        <button className="btn btn-dark rounded-pill px-4 py-2">
          Connexion
        </button>
      </Link>

      <p className="text-muted">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-decoration-none">
          S'inscrire
        </Link>
      </p>

    </div>
  );
};

export default HomePage;