import type { Client } from "../../types/client";

interface Props {
  clients: Client[];
  getStatusColor: (status: string) => string;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientsCards: React.FC<Props> = ({
  clients,
  getStatusColor,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="row g-3">
      {clients.map((client) => (
        <div className="col-md-4" key={client.id}>
          <div className="card shadow-sm p-3 h-100">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-0">{client.name}</h5>
                <small className="text-muted">{client.firstName}</small>
              </div>

              <span className={`badge bg-${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>

            {/* INFOS */}
            <p className="mt-2 mb-1">
              <i className="bi bi-envelope me-2"></i>
              {client.email}
            </p>

            <p className="mb-3">
              <i className="bi bi-geo-alt me-2"></i>
              {client.city}
            </p>

            {/* ACTIONS */}
            <div className="mt-auto d-flex justify-content-end gap-2">
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

          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsCards;