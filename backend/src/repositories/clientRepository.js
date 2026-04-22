const prisma = require('../config/db');

// GET ALL (par user)
const getAllClients = (userId) => {
  return prisma.client.findMany({
    where: { userId },
  });
};

// GET BY ID (sécurisé user)
const getClientById = (id, userId) => {
  return prisma.client.findFirst({
    where: {
      id,
      userId,
    },
  });
};

// GET BY EMAIL (global ou user-safe selon ton choix)
const getClientByEmail = (email) => {
  return prisma.client.findUnique({
    where: { email },
  });
};

// CREATE
const createClient = (data) => {
  return prisma.client.create({ data });
};

// UPDATE (sécurisé user)
const updateClient = (id, data, userId) => {
  return prisma.client.update({
    where: {
      id,
      userId,
    },
    data,
  });
};

// DELETE (sécurisé user)
const deleteClient = (id, userId) => {
  return prisma.client.delete({
    where: {
      id,
      userId,
    },
  });
};

module.exports = {
  getAllClients,
  getClientById,
  getClientByEmail,
  createClient,
  updateClient,
  deleteClient,
};