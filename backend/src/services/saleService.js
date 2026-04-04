const saleRepository = require('../repositories/saleRepository');

// LOGIQUE MÉTIER
function calculateCommission(amount) {
  if (amount >= 20000) return amount * 0.10;
  if (amount >= 10000) return amount * 0.07;
  return amount * 0.05;
}

// CREATE
async function createSale(data) {
  const commission = calculateCommission(data.amount);

  return await saleRepository.create({
    ...data,
    commission,
    signedAt: data.signedAt || new Date(),
  });
}

// UPDATE
async function updateSale(id, data) {
  let updatedData = { ...data };

  if (data.amount) {
    updatedData.commission = calculateCommission(data.amount);
  }

  return await saleRepository.update(id, updatedData);
}

// GET ALL
async function getAllSales() {
  return await saleRepository.findAll();
}

// GET BY ID
async function getSaleById(id) {
  return await saleRepository.findById(id);
}

// DELETE
async function deleteSale(id) {
  return await saleRepository.remove(id);
}

module.exports = {
  createSale,
  updateSale,
  getAllSales,
  getSaleById,
  deleteSale,
};