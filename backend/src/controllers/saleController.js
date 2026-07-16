const saleService = require('../services/saleService');

// GET ALL
exports.getAllSales = async (req, res) => {
  try {
  const sales = await saleService.getAllSales(
    req.user.id,
    req.user.role
  );  
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET BY ID
exports.getSale = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.json(sale);

  } catch (err) {
    res.status(404).json({
      error: err.message
    });
  }
};

// CREATE
exports.createSale = async (req,res)=>{
  try {
    const sale = await saleService.createSale({
      ...req.body,
      userId: req.user.id,
      role: req.user.role,
    });

    res.status(201).json(sale);

  } catch(err){
    res.status(400).json({
      error: err.message
    });
  }
};

// UPDATE
exports.updateSale = async (req, res) => {
  try {
    const sale = await saleService.updateSale(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );

    res.json(sale);

  } catch (err) {
    res.status(400).json({
    error: err.message
    });
  }
};

// DELETE
exports.deleteSale = async (req, res) => {
  try {
    await saleService.deleteSale(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.json({ message: 'Vente supprimée' });

  } catch (err) {
    res.status(400).json({
    error: err.message
    });
  }
};