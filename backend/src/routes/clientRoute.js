const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.use(authMiddleware);


router.get('/', clientController.getAllClients);

router.get('/:id', clientController.getClientById);


router.post(
 '/',
 roleMiddleware("COMMERCIAL","MANAGER"),
 clientController.createClient
);


router.put(
 '/:id',
 roleMiddleware("COMMERCIAL","MANAGER"),
 clientController.updateClient
);


router.delete(
 '/:id',
 roleMiddleware("COMMERCIAL","MANAGER"),
 clientController.deleteClient
);

module.exports = router;