const clientRepository = require('../repositories/clientRepository');

const getClients = async () => {
  return await clientRepository.getAllClients();
};

const getClient = async (id) => {
  const client = await clientRepository.getClientById(id);
  if (!client) {
    throw new Error('Client non trouvé');
  }
  return client;
};

const createClient = async (data) => {
  // exemple règle métier
  if (!data.email) {
    throw new Error('Email obligatoire');
  }

  return await clientRepository.createClient(data);
};

const updateClient = async (id, data) => {
  return await clientRepository.updateClient(id, data);
};

const deleteClient = async (id) => {
  return await clientRepository.deleteClient(id);
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};