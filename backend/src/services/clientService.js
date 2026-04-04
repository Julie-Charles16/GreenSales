const clientRepository = require('../repositories/clientRepository');

//  GET ALL
const getClients = async () => {
  return await clientRepository.getAllClients();
};

//  GET BY ID
const getClient = async (id) => {
  const client = await clientRepository.getClientById(id);

  if (!client) {
    throw new Error('Client non trouvé');
  }

  return client;
};

//  CREATE
const createClient = async (data) => {
  const { email, name, firstName } = data;

  //  VALIDATIONS
  if (!email || !name || !firstName) {
    throw new Error('Champs obligatoires manquants (email, name, firstName)');
  }

  //  Vérifier doublon email
  const existing = await clientRepository.getClientByEmail(email);

  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  return await clientRepository.createClient({
    ...data,
    status: data.status || "PROSPECT",
  });
};

//  UPDATE
const updateClient = async (id, data) => {
  // Vérifier si email modifié
  if (data.email) {
    const existing = await clientRepository.getClientByEmail(data.email);

    if (existing && existing.id !== id) {
      throw new Error('Email déjà utilisé');
    }
  }

  return await clientRepository.updateClient(id, data);
};

//  DELETE
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