const clientService = require('../services/clientService');

const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(req.user.id);
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClient(
      parseInt(req.params.id),
      req.user.id
    );
    res.json(client);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const createClient = async (req, res) => {
  try {
    const client = await clientService.createClient({
      ...req.body,
      userId: req.user.id, // 🔥 IMPORTANT
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );

    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await clientService.deleteClient(
      parseInt(req.params.id),
      req.user.id
    );

    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};