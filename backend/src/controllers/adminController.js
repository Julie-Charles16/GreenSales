const adminService = require("../services/adminService");


const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


module.exports = {
  getAllUsers,
};