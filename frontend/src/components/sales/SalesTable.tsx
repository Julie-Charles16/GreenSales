import type { Sale } from "../../types/sale";
import type { Client } from "../../types/client";

interface Props {
    clients: Client[];
    sales: Sale[];
    filteredSales: Sale[];
    getClientName: (clientId: number) => string;
    getClientProjectType: (clientId: number) => string;
    getStatusColor: (status: string) => string;
    formatDate: (date: string) => string;
    onEdit: (sale: Sale) => void;
    onDelete: (sale: Sale) => void;
}

const SalesTable: React.FC<Props> = ({
    filteredSales,
    getClientName,
    getClientProjectType,
    getStatusColor,
    formatDate,
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
                <th>Montant</th>
                <th>Commission</th>
                <th>Signé le</th>
                <th >Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
              <tr
                key={sale.id}
                className="table-row-hover"
                style={{
                  borderLeft: `4px solid ${
                    sale.status === "TERMINEE"
                      ? "#20c997"
                      : sale.status === "ANNULEE"
                      ? "#fa5252"
                      : "#adb5bd"
                  }`,
                }}
              >            
                  <td>
                    <div className="fw-semibold">
                      {getClientName(sale.clientId)}
                    </div>
                    <small className="text-muted">
                      {getClientProjectType(sale.clientId)}
                    </small>
                  </td>
                  <td className="fw-bold text-success">
                    {sale.amount} €
                  </td>
                  <td className="text-muted">
                    {sale.commission} €
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(sale.signedAt)}
                    </small>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 bg-${getStatusColor(
                        sale.status
                      )}`} 
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(sale)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(sale)}
                      >
                        <i className="bi bi-trash"></i>
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

export default SalesTable;