const appointmentService = require('../services/appointmentService');

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointments(req.user.id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointment(
      parseInt(req.params.id),
      req.user.id
    );

    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.updateAppointment(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await appointmentService.deleteAppointment(
      parseInt(req.params.id),
      req.user.id
    );

    res.json({ message: 'Rendez-vous supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};