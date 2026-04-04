const saleService = require('../services/saleService');

// GET
exports.getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET by ID
exports.getSale = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Vente non trouvée' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST
exports.createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body);
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Erreur création vente' });
  }
};

// PUT
exports.updateSale = async (req, res) => {
  try {
    const sale = await saleService.updateSale(req.params.id, req.body);
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Erreur mise à jour' });
  }
};

// DELETE
exports.deleteSale = async (req, res) => {
  try {
    await saleService.deleteSale(req.params.id);
    res.json({ message: 'Vente supprimée' });
  } catch (err) {
    res.status(400).json({ error: 'Erreur suppression' });
  }
};