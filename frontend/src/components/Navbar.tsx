import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
      <Link to="/">Accueil</Link>
      <Link to="/clients">Clients</Link>
      <Link to="/appointments">Rendez-vous</Link>
      <Link to="/sales">Ventes</Link>
    </nav>
  );
};

export default Navbar;