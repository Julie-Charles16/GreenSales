const clientRepository = require("../repositories/clientRepository");

// GET ALL (filtré par user)
const getClients = async (userId, role) => {

  // ADMIN : tous les clients
  if (role === "ADMIN") {
    return await clientRepository.getAllClients();
  }

  // MANAGER : ses clients + ceux de son équipe
  if (role === "MANAGER") {

    const ownClients = await clientRepository.getAllClients(userId);

    const teamClients = await clientRepository.getTeamClients(userId);

    return [
      ...new Map(
        [...ownClients, ...teamClients]
          .map(client => [client.id, client])
      ).values()
    ];
  }

  // COMMERCIAL : ses clients uniquement
  return await clientRepository.getAllClients(userId);
};


// GET BY ID (sécurisé selon le rôle)
const getClient = async (id, userId, role) => {

  let client;

  // ADMIN : accès à tous les clients
  if (role === "ADMIN") {

    client = await clientRepository.getClientById(id);

  }

  // MANAGER : ses clients + ceux de son équipe
  else if (role === "MANAGER") {

    client = await clientRepository.getClientById(id);

    if (
      client &&
      client.userId !== userId &&
      client.user.managerId !== userId
    ) {
      throw new Error("Accès interdit");
    }

  }

  // COMMERCIAL : uniquement ses clients
  else {

    client = await clientRepository.getClientById(
      id,
      userId
    );

  }

  if (!client) {
    throw new Error("Client non trouvé");
  }

  return client;
};


// CREATE
const createClient = async (data) => {

  const { email, name, firstName, userId, role } = data;

  if (role === "ADMIN") {
    throw new Error(
      "Un administrateur ne peut pas créer de client"
    );
  }

  if (!email || !name || !firstName || !userId) {
    throw new Error("Champs obligatoires manquants");
  }

  const existing = await clientRepository.getClientByEmail(email);

  if (existing) {
    throw new Error("Email déjà utilisé");
  }

  const clientData = { ...data };

  delete clientData.role;

  return await clientRepository.createClient({
    ...clientData,
    status: clientData.status || "PROSPECT",
  });

};


// UPDATE (sécurisé user)
const updateClient = async (id, data, userId, role) => {

  // ADMIN : pas de modification métier
  if (role === "ADMIN") {
    throw new Error(
      "Un administrateur ne peut pas modifier un client"
    );
  }

  const client = await clientRepository.getClientById(id);

  if (!client) {
    throw new Error("Client introuvable");
  }

  // COMMERCIAL et MANAGER ne peuvent modifier
  // que leurs propres clients.
  // Les clients de l'équipe restent accessibles
  // en lecture seule pour le manager.
  if (
    ["COMMERCIAL", "MANAGER"].includes(role) &&
    client.userId !== userId
  ) {
    throw new Error("Accès interdit");
  }

  if (data.email) {

    const existing =
      await clientRepository.getClientByEmail(data.email);

    if (
      existing &&
      existing.id !== id
    ) {
      throw new Error("Email déjà utilisé");
    }
  }

  return await clientRepository.updateClient(
    id,
    data
  );
};


// DELETE (sécurisé user)
const deleteClient = async (id, userId, role) => {

  // ADMIN : pas de suppression métier
  if (role === "ADMIN") {
    throw new Error(
      "Un administrateur ne peut pas supprimer un client"
    );
  }

  const client = await clientRepository.getClientById(id);

  if (!client) {
    throw new Error("Client introuvable");
  }

  // COMMERCIAL et MANAGER ne peuvent supprimer
  // que leurs propres clients.
  // Les clients de l'équipe restent accessibles
  // en lecture seule pour le manager.
  if (
    ["COMMERCIAL", "MANAGER"].includes(role) &&
    client.userId !== userId
  ) {
    throw new Error("Accès interdit");
  }

  return await clientRepository.deleteClient(id);

};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};