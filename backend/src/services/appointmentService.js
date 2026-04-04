const appointmentRepository = require('../repositories/appointmentRepository');

const getAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointment = async (id) => {
  const appointment = await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    throw new Error('Rendez-vous non trouvé');
  }

  return appointment;
};

const createAppointment = async (data) => {
  const { clientId, userId, date } = data;

  // 🔥 règle métier : éviter doublon
  const existing = await appointmentRepository.findExistingAppointment(
    clientId,
    userId,
    new Date(date)
  );

  if (existing) {
    throw new Error('Rendez-vous déjà existant');
  }

  return await appointmentRepository.createAppointment({
    ...data,
    date: new Date(date),
  });
};

const updateAppointment = async (id, data) => {
  return await appointmentRepository.updateAppointment(id, data);
};

const deleteAppointment = async (id) => {
  return await appointmentRepository.deleteAppointment(id);
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};