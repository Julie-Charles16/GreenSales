const prisma = require('../config/db');

// CREATE
async function create(data) {
  return await prisma.sale.create({ data });
}

// UPDATE (sécurisé user)
async function update(id, data, userId) {
  return await prisma.sale.updateMany({
    where: {
      id: parseInt(id),
      userId,
    },
    data,
  });
}

// GET ALL (par user)
async function findAll(userId) {
  return await prisma.sale.findMany({
    where: { userId },
    include: { client: true, user: true },
  });
}

// GET BY ID (sécurisé user)
async function findById(id, userId) {
  return await prisma.sale.findFirst({
    where: {
      id: parseInt(id),
      userId,
    },
  });
}

// DELETE (sécurisé user)
async function remove(id, userId) {
  return await prisma.sale.deleteMany({
    where: {
      id: parseInt(id),
      userId,
    },
  });
}

module.exports = {
  create,
  update,
  findAll,
  findById,
  remove,
};