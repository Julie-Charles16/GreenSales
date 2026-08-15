import React from "react";
import type { AdminUser } from "../../types/user";

interface Props {
  users: AdminUser[];
}

const UsersKPI: React.FC<Props> = ({ users }) => {
  return (
    <div className="row mb-4">

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Total</h6>
          <h4>{users.length}</h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Commerciaux</h6>
          <h4>
            {users.filter(
              (user) => user.role === "COMMERCIAL"
            ).length}
          </h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Managers</h6>
          <h4>
            {users.filter(
              (user) => user.role === "MANAGER"
            ).length}
          </h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Administrateurs</h6>
          <h4>
            {users.filter(
              (user) => user.role === "ADMIN"
            ).length}
          </h4>
        </div>
      </div>

    </div>
  );
};

export default UsersKPI;