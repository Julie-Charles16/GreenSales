const adminRepository = require("../repositories/adminRepository");

const ROLES = [
  "ADMIN",
  "MANAGER",
  "COMMERCIAL",
];

const getAllUsers = async () => {
  return await adminRepository.getAllUsers();
};


const updateUserRole = async (userId, newRole, currentUserId) => {

  // Vérification du rôle demandé
  if (!ROLES.includes(newRole)) {
    throw new Error("Rôle invalide");
  }


  // Empêche un admin de modifier son propre rôle
  if (userId === currentUserId) {
    throw new Error(
      "Vous ne pouvez pas modifier votre propre rôle"
    );
  }


  return await adminRepository.updateUserRole(
    userId,
    newRole
  );
};

const updateUserManager = async (userId, managerId) => {

  const manager = await adminRepository.getUserById(managerId);

  if (!manager) {
    throw new Error("Manager introuvable");
  }

  if (manager.role !== "MANAGER") {
    throw new Error("L'utilisateur choisi n'est pas un manager");
  }

  return await adminRepository.updateUserManager(
    userId,
    managerId
  );
};

const deleteUser = async (userId, currentUserId) => {

  // Empêche un admin de supprimer son propre compte
  if (userId === currentUserId) {
    throw new Error(
      "Vous ne pouvez pas supprimer votre propre compte"
    );
  }

  return await adminRepository.deleteUser(userId);
};


module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserManager,
  deleteUser,
};