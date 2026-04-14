import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>GreenSales</h1>
      <p>Votre CRM pour la gestion de votre activité commerciale.</p>

      <Link to="/login">
        <button className="">Connexion</button>
      </Link>

      <br />

      <Link to="/register">
        S'inscrire
      </Link>
    </div>
  );
};

export default HomePage;