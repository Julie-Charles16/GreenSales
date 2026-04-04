const saleRepository = require('../repositories/saleRepository');
const clientRepository = require('../repositories/clientRepository');

//  LOGIQUE MÉTIER : calcul commission
function calculateCommission(amount) {
  if (amount >= 20000) return amount * 0.10;
  if (amount >= 10000) return amount * 0.07;
  return amount * 0.05;
}

//  CREATE
async function createSale(data) {
  const { amount, clientId, userId } = data;

  //  VALIDATIONS
  if (!amount || amount <= 0) {
    throw new Error("Le montant doit être supérieur à 0");
  }

  if (!clientId || !userId) {
    throw new Error("clientId et userId sont obligatoires");
  }

  //  Vérifier que le client existe
  const client = await clientRepository.getClientById(clientId);
  if (!client) {
    throw new Error("Client introuvable");
  }

  //  Calcul commission
  const commission = calculateCommission(amount);

  return await saleRepository.create({
    ...data,
    commission,
    status: data.status || "EN_ATTENTE",
    signedAt: data.signedAt || new Date(),
  });
}

//  UPDATE
async function updateSale(id, data) {
  let updatedData = { ...data };

  //  Vérifier si on modifie le montant
  if (data.amount) {
    if (data.amount <= 0) {
      throw new Error("Le montant doit être supérieur à 0");
    }

    updatedData.commission = calculateCommission(data.amount);
  }

  return await saleRepository.update(id, updatedData);
}

//  GET ALL
async function getAllSales() {
  return await saleRepository.findAll();
}

//  GET BY ID
async function getSaleById(id) {
  const sale = await saleRepository.findById(id);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  return sale;
}

//  DELETE
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