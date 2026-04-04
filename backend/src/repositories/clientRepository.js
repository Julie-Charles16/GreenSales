const prisma = require('../config/db');

const getAllClients = () => {
  return prisma.client.findMany();
};

const getClientById = (id) => {
  return prisma.client.findUnique({
    where: { id },
  });
};

const createClient = (data) => {
  return prisma.client.create({ data });
};

const updateClient = (id, data) => {
  return prisma.client.update({
    where: { id },
    data,
  });
};

const deleteClient = (id) => {
  return prisma.client.delete({
    where: { id },
  });
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};