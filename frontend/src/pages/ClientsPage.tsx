import React, { useEffect, useState } from "react";
import { getClients, createClient, updateClient, deleteClient } from "../services/clientService";
import type { Client, ClientFormData } from "../types/client";
import ClientForm from "../components/ClientForm";

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // 🔥 chargement initial (CORRIGÉ)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchData();
  }, []);

  // 🔄 refresh manuel
  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  // CREATE
  const handleCreate = async (data: ClientFormData) => {
    await createClient(data);
    await loadClients();
  };

  // UPDATE
  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient) return;
    await updateClient(editingClient.id, data);
    setEditingClient(null);
    await loadClients();
  };

  // DELETE
  const handleDelete = async (id: number) => {
    await deleteClient(id);
    await loadClients();
  };

  return (
    <div>
      <h1>Liste des clients</h1>

      <h2>{editingClient ? "Modifier" : "Ajouter"}</h2>

      <ClientForm
        key={editingClient?.id || "new"}
        onSubmit={editingClient ? handleUpdate : handleCreate}
        initialData={editingClient}
      />

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} {client.firstName} - {client.email}

            <button onClick={() => setEditingClient(client)}>Modifier</button>
            <button onClick={() => handleDelete(client.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsPage;