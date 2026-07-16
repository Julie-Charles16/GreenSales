const saleRepository = require('../repositories/saleRepository');
const clientRepository = require('../repositories/clientRepository');

function calculateCommission(amount) {
  if (amount >= 20000) return amount * 0.10;
  if (amount >= 10000) return amount * 0.07;
  return amount * 0.05;
}

// CREATE
async function createSale(data) {
const { amount, clientId, userId, role } = data;

  if (!["COMMERCIAL", "MANAGER"].includes(role)) {
    throw new Error(
      "Seul un commercial ou un manager peut créer une vente"
    );
  }

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
    amount,
    clientId,
    userId,
    commission,
    status: data.status || "EN_ATTENTE",
    signedAt: data.signedAt || new Date(),
  });
}

// UPDATE
async function updateSale(id, data, userId, role) {

  if (role === "ADMIN") {
    throw new Error(
      "Un administrateur ne peut pas modifier une vente"
    );
  }

  const sale = await saleRepository.findById(id);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  // COMMERCIAL et MANAGER :
  // uniquement leurs propres ventes

  if (sale.userId !== userId) {
    throw new Error("Accès interdit");
  }

  let updatedData = { ...data };

  if (data.amount) {

    if (data.amount <= 0) {
      throw new Error(
        "Le montant doit être supérieur à 0"
      );
    }

    updatedData.commission = calculateCommission(
      data.amount
    );
  }

  return await saleRepository.update(
    id,
    updatedData,
    userId
  );
}

// GET ALL
async function getAllSales(userId, role) {

  // ADMIN
  if (role === "ADMIN") {
    return await saleRepository.findAll();
  }

  // MANAGER
  if (role === "MANAGER") {

    const ownSales = await saleRepository.findAll(userId);

    const teamSales = await saleRepository.findTeamSales(userId);

    return [
      ...ownSales,
      ...teamSales,
    ];
  }

  // COMMERCIAL
  return await saleRepository.findAll(userId);
}

// GET BY ID
async function getSaleById(id, userId, role) {

  let sale;

  // ADMIN : toutes les ventes
  if (role === "ADMIN") {

    sale = await saleRepository.findById(id);

  }

  // MANAGER : ses ventes + équipe
  else if (role === "MANAGER") {

    sale = await saleRepository.findById(id);

    if (
      sale &&
      sale.userId !== userId &&
      sale.user.managerId !== userId
    ) {
      throw new Error("Accès interdit");
    }

  }

  // COMMERCIAL : uniquement ses ventes
  else {

    sale = await saleRepository.findById(id, userId);

  }

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  return sale;
}

// DELETE
async function deleteSale(id, userId, role) {

  if (role === "ADMIN") {
    throw new Error(
      "Un administrateur ne peut pas supprimer une vente"
    );
  }

  const sale = await saleRepository.findById(id);

  if (!sale) {
    throw new Error("Vente introuvable");
  }

  if (sale.userId !== userId) {
    throw new Error("Accès interdit");
  }

  return await saleRepository.remove(
    id,
    userId
  );
}

module.exports = {
  createSale,
  updateSale,
  getAllSales,
  getSaleById,
  deleteSale,
};