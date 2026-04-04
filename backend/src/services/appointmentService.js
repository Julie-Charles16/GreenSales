const appointmentRepository = require('../repositories/appointmentRepository');
const clientRepository = require('../repositories/clientRepository');

//  GET ALL
const getAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

//  GET BY ID
const getAppointment = async (id) => {
  const appointment = await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    throw new Error('Rendez-vous non trouvé');
  }

  return appointment;
};

//  CREATE
const createAppointment = async (data) => {
  const { clientId, userId, date } = data;

  // ❌ VALIDATIONS
  if (!clientId || !userId || !date) {
    throw new Error('clientId, userId et date sont obligatoires');
  }

  const appointmentDate = new Date(date);

  if (isNaN(appointmentDate)) {
    throw new Error('Date invalide');
  }

  //  Vérifier que le client existe
  const client = await clientRepository.getClientById(clientId);
  if (!client) {
    throw new Error('Client introuvable');
  }

  //  règle métier : éviter doublon
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

//  UPDATE
const updateAppointment = async (id, data) => {
  if (data.date) {
    const appointmentDate = new Date(data.date);

    if (isNaN(appointmentDate)) {
      throw new Error('Date invalide');
    }

    data.date = appointmentDate;
  }

  return await appointmentRepository.updateAppointment(id, data);
};

//  DELETE
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