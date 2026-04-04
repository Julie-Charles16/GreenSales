const prisma = require('../config/db');

// CREATE
async function create(data) {
  return await prisma.sale.create({ data });
}

// UPDATE
async function update(id, data) {
  return await prisma.sale.update({
    where: { id: parseInt(id) },
    data,
  });
}

// GET ALL
async function findAll() {
  return await prisma.sale.findMany({
    include: { client: true, user: true },
  });
}

// GET BY ID
async function findById(id) {
  return await prisma.sale.findUnique({
    where: { id: parseInt(id) },
  });
}

// DELETE
async function remove(id) {
  return await prisma.sale.delete({
    where: { id: parseInt(id) },
  });
}

module.exports = {
  create,
  update,
  findAll,
  findById,
  remove,
};