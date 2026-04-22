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
    const {
      name,
      firstName,
      address,
      city,
      postalCode,
      email,
      phone,
      projectType,
      status,
    } = req.body;

    // 🔴 VALIDATION BACK (OBLIGATOIRE)
    if (!name || !firstName || !email) {
      return res.status(400).json({
        message: "Nom, prénom et email sont obligatoires",
      });
    }

    // 🔴 CHECK EMAIL EXISTANT
    const existingClient = await prisma.client.findFirst({
  where: {
    email,
    userId: req.user.id,
  },
});

    if (existingClient) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé",
      });
    }

    const client = await clientService.createClient({
      name,
      firstName,
      address,
      city,
      postalCode,
      email,
      phone,
      projectType,
      status,
      userId: req.user.id,
    });

    return res.status(201).json(client);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur serveur",
    });
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
  return res.status(400).json({ message: err.message });
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