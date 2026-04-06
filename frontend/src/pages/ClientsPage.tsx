import { useEffect, useState } from 'react';
import { getClients } from '../services/clientService';
import type { Client } from '../types/client';

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  return (
    <div>
      <h2>Liste des clients</h2>

      {clients.map((client) => (
        <div key={client.id}>
          {client.name} {client.firstName} - {client.email}
        </div>
      ))}
    </div>
  );
}

export default ClientsPage;