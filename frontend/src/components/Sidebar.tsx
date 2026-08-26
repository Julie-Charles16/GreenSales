import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { canManageUsers } from "../utils/permissions";
import UserBadge from "./common/UserBadge";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
    (isActive
      ? "bg-light text-dark fw-bold"
      : "text-white");

  return (
<div
  className="bg-dark text-white d-flex flex-column p-3"
  style={{
    width: "250px",
    height: "100vh",
    position: "sticky",
    top: 0
  }}
    >
      {/* Logo */}
      <h4 className="fw-bold mb-4">
        <i className="bi bi-leaf-fill me-2"></i>
        GreenSales
      </h4>

      {/* User */}
      <div className="mb-4 text-white">
        <div>
          <i className="bi bi-person me-2"></i>
          Bonjour {user?.pseudo}
        </div>

        {user?.manager && (
          <div className="mt-2">
            <small className="text-white-50 d-block mb-1">
              Votre manager
            </small>

            <UserBadge
              pseudo={user.manager.pseudo}
              role={user.manager.role}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column gap-2 flex-grow-1 overflow-auto">
        <li>
          <NavLink to="/dashboard" className={linkClass}>
            <i className="bi bi-speedometer2"></i>
            Tableau de bord
          </NavLink>
        </li>

        {user && canManageUsers(user.role) && (
          <li>
            <NavLink to="/users" className={linkClass}>
              <i className="bi bi-person-gear"></i>
              Utilisateurs
            </NavLink>
          </li>
        )}
        
        <li>
          <NavLink to="/clients" className={linkClass}>
            <i className="bi bi-people"></i>
            Clients
          </NavLink>
        </li>

        <li>
          <NavLink to="/sales" className={linkClass}>
            <i className="bi bi-cash-stack"></i>
            Ventes
          </NavLink>
        </li>

        <li>
          <NavLink to="/appointments" className={linkClass}>
            <i className="bi bi-calendar-event"></i>
            Rendez-vous
          </NavLink>
        </li>

          <li>
            <NavLink to="/settings" className={linkClass}>
              <i className="bi bi-gear"></i>
              Paramètres
            </NavLink>
          </li>
      </ul>

      {/* Déconnexion en bas */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-light w-100 rounded-pill"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
