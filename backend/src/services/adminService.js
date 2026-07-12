const adminRepository = require("../repositories/adminRepository");


const getUsers = async () => {
  return await adminRepository.getAllUsers();
};


module.exports = {
  getUsers,
};