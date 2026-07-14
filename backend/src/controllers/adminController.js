const adminService = require("../services/adminService");

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    const user = await adminService.updateUserRole(
      userId,
      role,
      req.user.id
    );

    res.json({
      message: "Rôle utilisateur modifié",
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(400).json({
      message: err.message,
    });
  }
};

const updateUserManager = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { managerId } = req.body;

    const user = await adminService.updateUserManager(
      userId,
      managerId
    );

    res.json({
      message: "Manager assigné",
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(400).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await adminService.deleteUser(
      userId,
      req.user.id
    );

    res.json({
      message: "Utilisateur supprimé",
    });

  } catch (err) {
    console.error(err);

    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserManager,
  deleteUser,
};