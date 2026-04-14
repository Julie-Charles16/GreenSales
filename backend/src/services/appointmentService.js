const appointmentRepository = require('../repositories/appointmentRepository');
const clientRepository = require('../repositories/clientRepository');

// GET ALL (par user)
const getAppointments = async (userId) => {
  return await appointmentRepository.getAllAppointments(userId);
};

// GET BY ID (sécurisé)
const getAppointment = async (id, userId) => {
  const appointment = await appointmentRepository.getAppointmentById(id, userId);

  if (!appointment) {
    throw new Error('Rendez-vous non trouvé');
  }

  return appointment;
};

// CREATE
const createAppointment = async (data) => {
  const { clientId, userId, date } = data;

  if (!clientId || !userId || !date) {
    throw new Error('clientId, userId et date sont obligatoires');
  }

  const appointmentDate = new Date(date);

  if (isNaN(appointmentDate)) {
    throw new Error('Date invalide');
  }

  // 🔐 vérifier client appartenant au user
  const client = await clientRepository.getClientById(clientId, userId);

  if (!client) {
    throw new Error('Client introuvable');
  }

  const existing = await appointmentRepository.findExistingAppointment(
    clientId,
    userId,
    appointmentDate
  );

  if (existing) {
    throw new Error('Un rendez-vous existe déjà à cette date');
  }

  return await appointmentRepository.createAppointment({
    ...data,
    date: appointmentDate,
    status: data.status || "PLANIFIE",
  });
};

// UPDATE
const updateAppointment = async (id, data, userId) => {
  const appointment = await appointmentRepository.getAppointmentById(id, userId);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (data.date) {
    const appointmentDate = new Date(data.date);

    if (isNaN(appointmentDate)) {
      throw new Error('Date invalide');
    }

    data.date = appointmentDate;
  }

  return await appointmentRepository.updateAppointment(id, data, userId);
};

// DELETE
const deleteAppointment = async (id, userId) => {
  const appointment = await appointmentRepository.getAppointmentById(id, userId);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  return await appointmentRepository.deleteAppointment(id, userId);
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};