import type { Client } from "../../types/client";

interface Props {
  clients: Client[];
  getStatusColor: (status: string) => string;
  getStatusBorderColor: (status: string) => string;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientsCards: React.FC<Props> = ({
  clients,
  getStatusColor,
  getStatusBorderColor,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="row g-3">
      {clients.map((client) => (
        <div className="col-md-4" key={client.id}>
          <div 
            className="card shadow-sm p-3 h-100"
            style={{
              borderLeft: `4px solid ${getStatusBorderColor(client.status)}`,
            }}
          >

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex justicy-content-between gap-2">
                <h5 className="mb-0">{client.name}</h5>
                <h5 className="mb-0">{client.firstName}</h5>
              </div>

            </div>

            <small>{client.projectType}</small>

            {/* INFOS */}
            <p className="mt-2 mb-1">
              <i className="bi bi-envelope-at me-2"></i>
              {client.email}
            </p>
            <p className="mt-2 mb-1">
              <i className="bi bi-telephone me-2"></i>
              {client.phone}
            </p>

            <p className="mb-3 d-flex align-items-start">
              <i className="bi bi-geo-alt me-2 mt-1"></i>
              <span>
                {client.address}<br />
                {client.postalCode} {client.city}
              </span>
            </p>

            {/* ACTIONS */}
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <span className={`badge bg-${getStatusColor(client.status)}`}>
                  {client.status}
                </span>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(client);
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(client);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsCards;