const prisma = require('../config/db');

const getAllAppointments = () => {
  return prisma.appointment.findMany({
    include: { client: true, user: true },
  });
};

const getAppointmentById = (id) => {
  return prisma.appointment.findUnique({
    where: { id },
  });
};

const createAppointment = (data) => {
  return prisma.appointment.create({ data });
};

const updateAppointment = (id, data) => {
  return prisma.appointment.update({
    where: { id },
    data,
  });
};

const deleteAppointment = (id) => {
  return prisma.appointment.delete({
    where: { id },
  });
};

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