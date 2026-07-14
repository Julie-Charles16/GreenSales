const prisma = require('../config/db');

// GET ALL (par user)
const getAllClients = (userId = null) => {
  return prisma.client.findMany({
    where: userId ? { userId } : {},
  });
};

// GET BY ID (sécurisé user)
const getClientById = (id, userId = null) => {
  return prisma.client.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
    include: {
      user: {
        select: {
          managerId: true,
        },
      },
    },
  });
};

// GET BY EMAIL (global ou user-safe selon ton choix)
const getClientByEmail = (email) => {
  return prisma.client.findUnique({
    where: { email },
  });
};

const getTeamClients = (managerId) => {
  return prisma.client.findMany({
    where: {
      user: {
        managerId,
      },
    },
  });
};

// CREATE
const createClient = (data) => {
  return prisma.client.create({ data });
};

// UPDATE (sécurisé user)
const updateClient = (id, data) => {
  return prisma.client.update({
    where: {
      id,
    },
    data,
  });
};

// DELETE (sécurisé user)
const deleteClient = (id) => {
  return prisma.client.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  getAllClients,
  getClientById,
  getClientByEmail,
  getTeamClients,
  createClient,
  updateClient,
  deleteClient,

};