import React from "react";
import Login from "../components/loginForm";

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginPage: React.FC<Props> = ({ setToken }) => {
  return (
    <div>
      <h2>Connexion</h2>
      <Login setToken={setToken} />
    </div>
  );
};

export default LoginPage;