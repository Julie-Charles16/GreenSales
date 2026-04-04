// const express = require('express');
// const router = express.Router();
// const prisma = require('../config/db'); // connexion Prisma

// // GET all clients
// router.get('/', async (req, res) => {
//   try {
//     const clients = await prisma.client.findMany();
//     res.json(clients);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // POST create a new client
// router.post('/', async (req, res) => {
//   const data = req.body;
//   try {
//     const newClient = await prisma.client.create({ data });
//     res.status(201).json(newClient);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ error: 'Impossible de créer le client' });
//   }
// });

// // GET client by ID
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const client = await prisma.client.findUnique({ where: { id: parseInt(id) } });
//     if (!client) return res.status(404).json({ error: 'Client non trouvé' });
//     res.json(client);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // PUT update client
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const data = req.body;
//   try {
//     const updatedClient = await prisma.client.update({
//       where: { id: parseInt(id) },
//       data,
//     });
//     res.json(updatedClient);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ error: 'Impossible de mettre à jour le client' });
//   }
// });

// // DELETE client
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.client.delete({ where: { id: parseInt(id) } });
//     res.json({ message: 'Client supprimé' });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ error: 'Impossible de supprimer le client' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;