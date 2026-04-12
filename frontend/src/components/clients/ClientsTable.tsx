import type { Client } from "../../types/client";

interface Props {
  clients: Client[];
  getStatusColor: (status: string) => string;
  getStatusBorderColor: (status: string) => string;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientsTable: React.FC<Props> = ({
  clients,
  getStatusColor,
  getStatusBorderColor,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                style={{
                  borderLeft: `4px solid ${getStatusBorderColor(client.status)}`,
                }}
              >
                {/* Nom */}
                <td>
                  <div className="fw-semibold">
                    {client.name} {client.firstName}
                  </div>
                  <small className="text-muted">
                    {client.projectType}
                  </small>
                </td>

                {/* Email */}
                <td className="text-muted">
                  {client.email}
                </td>

                {/* Ville */}
                <td>
                  {client.address}, {client.postalCode} {client.city}
                </td>

                {/* Statut */}
                <td>
                  <span className={`badge bg-${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => onView(client)}
                    >
                      👁️
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(client)}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(client)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;