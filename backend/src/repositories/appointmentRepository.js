const prisma = require('../config/db');

// GET ALL (par user)
const getAllAppointments = (userId) => {
  return prisma.appointment.findMany({
    where: { userId },
    include: { client: true, user: true },
  });
};

// GET BY ID (sécurisé user)
const getAppointmentById = (id, userId) => {
  return prisma.appointment.findFirst({
    where: {
      id,
      userId,
    },
  });
};

// CREATE
const createAppointment = (data) => {
  return prisma.appointment.create({ data });
};

// UPDATE (sécurisé user)
const updateAppointment = (id, data, userId) => {
  return prisma.appointment.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });
};

// DELETE (sécurisé user)
const deleteAppointment = (id, userId) => {
  return prisma.appointment.deleteMany({
    where: {
      id,
      userId,
    },
  });
};

// CHECK EXISTING (déjà bon 👍)
const findExistingAppointment = (clientId, userId, date) => {
  return prisma.appointment.findFirst({
    where: {
      clientId,
      userId,
      date,
    },
  });
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  findExistingAppointment,
};