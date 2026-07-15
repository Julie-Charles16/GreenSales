const appointmentRepository = require('../repositories/appointmentRepository');
const clientRepository = require('../repositories/clientRepository');

// GET ALL (par user)
const getAppointments = async (userId, role) => {
  console.log("USER ID :", userId);
  console.log("ROLE :", role);
  // ADMIN
  if (role === "ADMIN") {
    return await appointmentRepository.getAllAppointments();
  }

  // MANAGER
  if (role === "MANAGER") {

    const ownAppointments =
      await appointmentRepository.getAllAppointments(userId);

    const teamAppointments =
      await appointmentRepository.getTeamAppointments(userId);

    return [
      ...ownAppointments,
      ...teamAppointments,
    ];
  }

  // COMMERCIAL
  return await appointmentRepository.getAllAppointments(userId);
};

// GET BY ID (sécurisé)
const getAppointment = async (id, userId, role) => {

  const appointment = await appointmentRepository.getAppointmentById(id);


  if (!appointment) {
    throw new Error("Rendez-vous non trouvé");
  }


  // ADMIN : lecture uniquement
  if (role === "ADMIN") {
    return appointment;
  }


  // MANAGER : ses rendez-vous + ceux de son équipe
  if (role === "MANAGER") {

    if (
      appointment.userId !== userId &&
      appointment.user.managerId !== userId
    ) {
      throw new Error("Accès interdit");
    }

    return appointment;
  }


  // COMMERCIAL : uniquement ses rendez-vous
  if (
    role === "COMMERCIAL" &&
    appointment.userId !== userId
  ) {
    throw new Error("Accès interdit");
  }


  return appointment;
};

// CREATE
const createAppointment = async (data) => {
  const { clientId, userId, date, role } = data;

  if (!clientId || !userId || !date) {
    throw new Error('clientId, userId et date sont obligatoires');
  }

  // ADMIN : lecture uniquement
  if (role === "ADMIN") {
    throw new Error("Un administrateur ne peut pas créer de rendez-vous");
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
    clientId,
    userId,
    date: appointmentDate,
    status: data.status || "PLANIFIE",
    comment: data.comment,
  });
};

// UPDATE
const updateAppointment = async (id, data, userId, role) => {

  const appointment = await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }


  // ADMIN : lecture uniquement
  if (role === "ADMIN") {
    throw new Error("Action interdite pour un administrateur");
  }


  // COMMERCIAL : uniquement ses rendez-vous
  if (
    role === "COMMERCIAL" &&
    appointment.userId !== userId
  ) {
    throw new Error("Accès interdit");
  }


  // MANAGER : uniquement ses propres rendez-vous
  if (
    role === "MANAGER" &&
    appointment.userId !== userId
  ) {
    throw new Error("Un manager ne peut pas modifier les rendez-vous de son équipe");
  }


  if (data.date) {

    const appointmentDate = new Date(data.date);

    if (isNaN(appointmentDate)) {
      throw new Error("Date invalide");
    }

    data.date = appointmentDate;
  }


  return await appointmentRepository.updateAppointment(
    id,
    data
  );
};

// DELETE
const deleteAppointment = async (id, userId, role) => {

  const appointment = await appointmentRepository.getAppointmentById(id);


  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }


  // ADMIN : lecture uniquement
  if (role === "ADMIN") {
    throw new Error("Action interdite pour un administrateur");
  }


  // COMMERCIAL : uniquement ses rendez-vous
  if (
    role === "COMMERCIAL" &&
    appointment.userId !== userId
  ) {
    throw new Error("Accès interdit");
  }


  // MANAGER : uniquement ses propres rendez-vous
  if (
    role === "MANAGER" &&
    appointment.userId !== userId
  ) {
    throw new Error("Un manager ne peut pas supprimer les rendez-vous de son équipe");
  }


  return await appointmentRepository.deleteAppointment(id);
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};