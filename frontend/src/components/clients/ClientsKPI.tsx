import React from "react";
import type { Client } from "../../types/client";

interface Props {
  clients: Client[];
}

const ClientsKPI: React.FC<Props> = ({ clients }) => {
  return (
    <div className="row mb-4">
        <div className="col-md-3">
            <div className="card p-3 shadow-sm">
                <h6>Total</h6>
                <h4>{clients.length}</h4>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card p-3 shadow-sm">
                <h6>Prospects</h6>
                <h4>{clients.filter(c => c.status === "PROSPECT").length}</h4>
            </div>
        </div>
        <div className="col-md-3">
            <div className="card p-3 shadow-sm">
                <h6>Négociation</h6>
                <h4>{clients.filter(c => c.status === "NEGOCIATION").length}</h4>
            </div>
        </div>
            <div className="col-md-3">
            <div className="card p-3 shadow-sm">
                <h6>Signés</h6>
                <h4>{clients.filter(c => c.status === "SIGNE").length}</h4>
            </div>
        </div>
    </div>
    ); 
};

export default ClientsKPI;