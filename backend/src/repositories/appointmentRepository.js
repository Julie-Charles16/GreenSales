const prisma = require('../config/db');

// GET ALL (par user)
const getAllAppointments = (userId = null) => {
  return prisma.appointment.findMany({
    where: userId ? { userId } : {},
    include: {
      client: true,
      user: true,
    },
  });
};

const getTeamAppointments = (managerId) => {
  return prisma.appointment.findMany({
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
};

// GET BY ID
const getAppointmentById = (id) => {
  return prisma.appointment.findFirst({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          managerId: true,
        },
      },
      client: true,
    },
  });
};

// CREATE
const createAppointment = (data) => {
  return prisma.appointment.create({ data });
};

// UPDATE (sécurisé user)
const updateAppointment = (id, data) => {
  return prisma.appointment.update({
    where: {
      id,
    },
    data,
  });
};

// DELETE (sécurisé user)
const deleteAppointment = (id) => {
  return prisma.appointment.delete({
    where: {
      id,
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
  getTeamAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  findExistingAppointment,
};