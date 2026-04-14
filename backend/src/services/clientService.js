const clientRepository = require('../repositories/clientRepository');

// GET ALL (filtré par user)
const getClients = async (userId) => {
  return await clientRepository.getAllClients(userId);
};

// GET BY ID (sécurisé user)
const getClient = async (id, userId) => {
  const client = await clientRepository.getClientById(id, userId);

  if (!client) {
    throw new Error('Client non trouvé');
  }

  return client;
};

// CREATE
const createClient = async (data) => {
  const { email, name, firstName, userId } = data;

  if (!email || !name || !firstName || !userId) {
    throw new Error('Champs obligatoires manquants');
  }

  const existing = await clientRepository.getClientByEmail(email);

  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  return await clientRepository.createClient({
    ...data,
    status: data.status || "PROSPECT",
  });
};

// UPDATE (sécurisé user)
const updateClient = async (id, data, userId) => {
  const client = await clientRepository.getClientById(id, userId);

  if (!client) {
    throw new Error("Client introuvable");
  }

  if (data.email) {
    const existing = await clientRepository.getClientByEmail(data.email);

    if (existing && existing.id !== id) {
      throw new Error('Email déjà utilisé');
    }
  }

  return await clientRepository.updateClient(id, data, userId);
};

// DELETE (sécurisé user)
const deleteClient = async (id, userId) => {
  const client = await clientRepository.getClientById(id, userId);

  if (!client) {
    throw new Error("Client introuvable");
  }

  return await clientRepository.deleteClient(id, userId);
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};