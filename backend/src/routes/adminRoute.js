const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const adminController = require("../controllers/adminController");


router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllUsers
);

router.patch(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.updateUserRole
);

router.patch(
  "/users/:id/managerId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.updateUserManager
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.deleteUser
);

module.exports = router;