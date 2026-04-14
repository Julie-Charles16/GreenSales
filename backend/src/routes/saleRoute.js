const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 PROTECTION TOTALE
router.get('/', authMiddleware, saleController.getAllSales);
router.get('/:id', authMiddleware, saleController.getSale);
router.post('/', authMiddleware, saleController.createSale);
router.put('/:id', authMiddleware, saleController.updateSale);
router.delete('/:id', authMiddleware, saleController.deleteSale);

module.exports = router;