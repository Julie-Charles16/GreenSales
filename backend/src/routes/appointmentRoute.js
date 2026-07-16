const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.use(authMiddleware);


// Lecture : tout utilisateur connecté
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);


// Création : commercial ou manager
router.post(
  '/',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  appointmentController.createAppointment
);


// Modification : commercial ou manager
router.put(
  '/:id',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  appointmentController.updateAppointment
);


// Suppression : commercial ou manager
router.delete(
  '/:id',
  roleMiddleware("COMMERCIAL", "MANAGER"),
  appointmentController.deleteAppointment
);


module.exports = router;