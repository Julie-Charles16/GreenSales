import type { Sale } from "../../types/sale";
import { getSaleStatusBorderColor } from "../../utils/statusColors";
// import type { Client } from "../../types/client";
import UserBadge from "../common/UserBadge";

interface Props {
    filteredSales: Sale[];
    getClientName: (clientId: number) => string;
    getClientProjectType: (clientId: number) => string;
    getStatusColor: (status: string) => string;
    formatDate: (date: string) => string;
    onEdit: (sale: Sale) => void;
    onDelete: (sale: Sale) => void;
    canEdit: (sale: Sale) => boolean;
    canDelete: (sale: Sale) => boolean;
    showCommercial: boolean;
}

const SalesTable: React.FC<Props> = ({
    filteredSales,
    getClientName,
    getClientProjectType,
    getStatusColor,
    formatDate,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
    showCommercial,
}) => {
    const hasActions = filteredSales.some((sale) => canEdit(sale) || canDelete(sale));
    return (
        <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                {showCommercial && <th>Commercial</th>}
                <th>Client</th>
                <th>Montant</th>
                <th>Commission</th>
                <th>Signé le</th>
                <th >Statut</th>
                {hasActions && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
              <tr
                key={sale.id}
                className="table-row-hover"
                style={{
                  borderLeft: `4px solid ${getSaleStatusBorderColor(sale.status)}`,
                }}
              >     
                {showCommercial && (
                  <td>
                    {sale.user && (
                      <UserBadge
                        pseudo={sale.user.pseudo}
                        role={sale.user.role}
                      />
                    )}
                  </td>
                )}       
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

                  {hasActions && <td>
                    <div className="d-flex gap-2 mt-2">
                      {canEdit(sale) && <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(sale)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>}
                      {canDelete(sale) && <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(sale)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>}
                    </div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default SalesTable;
