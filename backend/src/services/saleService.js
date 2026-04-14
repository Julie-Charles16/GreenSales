const saleRepository = require('../repositories/saleRepository');
const clientRepository = require('../repositories/clientRepository');

function calculateCommission(amount) {
  if (amount >= 20000) return amount * 0.10;
  if (amount >= 10000) return amount * 0.07;
  return amount * 0.05;
}

// CREATE
async function createSale(data) {
  const { amount, clientId, userId } = data;

  if (!amount || amount <= 0) {
    throw new Error("Le montant doit être supérieur à 0");
  }

  if (!clientId || !userId) {
    throw new Error("clientId et userId sont obligatoires");
  }

  // 🔐 client appartenant au user
  const client = await clientRepository.getClientById(clientId, userId);

  if (!client) {
    throw new Error("Client introuvable");
  }

  const commission = calculateCommission(amount);

  return await saleRepository.create({
    ...data,
    commission,
    status: data.status || "EN_ATTENTE",
    signedAt: data.signedAt || new Date(),
  });
}

// UPDATE
async function updateSale(id, data, userId) {
  const sale = await saleRepository.findById(id, userId);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  let updatedData = { ...data };

  if (data.amount) {
    if (data.amount <= 0) {
      throw new Error("Le montant doit être supérieur à 0");
    }

    updatedData.commission = calculateCommission(data.amount);
  }

  return await saleRepository.update(id, updatedData, userId);
}

// GET ALL
async function getAllSales(userId) {
  return await saleRepository.findAll(userId);
}

// GET BY ID
async function getSaleById(id, userId) {
  const sale = await saleRepository.findById(id, userId);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  return sale;
}

// DELETE
async function deleteSale(id, userId) {
  const sale = await saleRepository.findById(id, userId);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  return await saleRepository.remove(id, userId);
}

module.exports = {
  createSale,
  updateSale,
  getAllSales,
  getSaleById,
  deleteSale,
};