const prisma = require('../config/db');

// CREATE
async function create(data) {
  return await prisma.sale.create({ data });
}

// UPDATE (sécurisé user)
async function update(id, data, userId = null) {
  return await prisma.sale.updateMany({
    where: {
      id: parseInt(id),
      ...(userId ? { userId } : {}),
    },
    data,
  });
}

// GET ALL (par user)
async function findAll(userId = null) {
  return await prisma.sale.findMany({
    where: userId ? { userId } : {},
    include: {
      client: true,
      user: true,
    },
  });
}

async function findTeamSales(managerId) {
  return await prisma.sale.findMany({
    where: {
      user: {
        managerId,
      },
    },
    include: {
      client: true,
      user: true,
    },
  });
}

// GET BY ID (sécurisé user)
async function findById(id, userId = null) {
  return await prisma.sale.findFirst({
    where: {
      id: parseInt(id),
      ...(userId ? { userId } : {}),
    },
    include: {
      client: true,
      user: true,
    },
  });
}


// DELETE (sécurisé user)
async function remove(id, userId = null) {
  return await prisma.sale.deleteMany({
    where: {
      id: parseInt(id),
      ...(userId ? { userId } : {}),
    },
  });
}

module.exports = {
  create,
  update,
  findAll,
  findTeamSales,
  findById,
  remove,
};