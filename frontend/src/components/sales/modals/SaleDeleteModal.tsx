import React from 'react';
import type { Sale } from '../../../types/sale';

interface Props {
  sale: Sale | null;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onConfirm: () => void;
  getClientName: (clientId: number) => string;
}

const SaleDeleteModal: React.FC<Props> = ({
  sale,
  modalRef,
  getClientName,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="modal fade" ref={modalRef} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="text-danger">⚠️ Supprimer</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p>Voulez-vous vraiment supprimer cette vente ?</p>

            {sale && (
              <div className="alert alert-light border">
                <strong>{getClientName(sale.clientId)}</strong>
                <br />
                <small>{sale.amount} €</small>
              </div>
            )}

            <p className="text-danger mb-0">Action irréversible</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>

            <button className="btn btn-danger" onClick={onConfirm}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDeleteModal;