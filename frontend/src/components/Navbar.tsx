import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const Navbar: React.FC<NavbarProps> = ({ setToken }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setToken(null);

  navigate("/");
};

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/dashboard">
        <i className="bi bi-leaf-fill me-2"></i>
        GreenSales
      </Link>
      <span className="text-white">👤 Bonjour {user?.pseudo}</span>

      {/* Toggle button for mobile view */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto gap-3">
          {/* <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="bi bi-house me-1"></i> Accueil
            </Link>
          </li> */}
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="bi bi-speedometer2 me-1"></i> Tableau de bord
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/clients">
              <i className="bi bi-people me-1"></i> Clients
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sales">
              <i className="bi bi-cash-stack me-1"></i> Ventes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/appointments">
              <i className="bi bi-calendar-event me-1"></i> Rendez-vous
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link btn btn-link">
              <i className="bi bi-box-arrow-right me-1"></i> Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;