import React, { useEffect, useState } from "react";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "../services/saleService";
import { getClients } from "../services/clientService";

import type { Sale, SaleFormData } from "../types/sale";
import type { Client } from "../types/client";

import SaleForm from "../components/SaleForm";

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Sale | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [salesData, clientsData] = await Promise.all([
        getSales(),
        getClients(),
      ]);

      setSales(salesData);
      setClients(clientsData);
    };

    fetchData();
  }, []);

  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };

  const handleCreate = async (data: SaleFormData) => {
    await createSale(data);
    await loadSales();
  };

  const handleUpdate = async (data: SaleFormData) => {
    if (!editing) return;

    await updateSale(editing.id, data);
    setEditing(null);
    await loadSales();
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id);
    await loadSales();
  };

  const getClientName = (clientId: number): string => {
    const client = clients.find((c) => c.id === clientId);
    return client
      ? `${client.name} ${client.firstName}`
      : "Client inconnu";
  };

  return (
    <div>
      <h1>Ventes</h1>

      <h2>{editing ? "Modifier une vente" : "Ajouter une vente"}</h2>

      <SaleForm
        key={editing?.id || "new"}
        initialData={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        clients={clients}
        onCancel={handleCancel}
      />

      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            {sale.amount} € - {sale.commission} € (commission) -{" "}
            {getClientName(sale.clientId)} - {sale.status}

            <button onClick={() => setEditing(sale)}>Modifier</button>
            <button onClick={() => handleDelete(sale.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesPage;