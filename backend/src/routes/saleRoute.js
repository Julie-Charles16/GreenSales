const express = require('express');
const router = express.Router();

const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.use(authMiddleware);


// Lecture
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSale);


// Création
router.post(
  '/',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  saleController.createSale
);


// Modification
router.put(
  '/:id',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  saleController.updateSale
);


// Suppression
router.delete(
  '/:id',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  saleController.deleteSale
);


module.exports = router;