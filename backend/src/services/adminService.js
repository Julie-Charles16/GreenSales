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

  if (!ROLES.includes(newRole)) {
    throw new Error("Rôle invalide");
  }

  if (userId === currentUserId) {
    throw new Error(
      "Vous ne pouvez pas modifier votre propre rôle"
    );
  }

  const user = await adminRepository.getUserById(userId);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  if (newRole !== "COMMERCIAL") {
    await adminRepository.updateUserManager(
      userId,
      null
    );
  }

  return await adminRepository.updateUserRole(
    userId,
    newRole
  );
};

const updateUserManager = async (userId, managerId) => {

  const user = await adminRepository.getUserById(userId);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  if (user.role !== "COMMERCIAL") {
    throw new Error("Seuls les commerciaux peuvent être rattachés à un manager");
  }

  // Suppression de l'affectation
  if (managerId === null) {
    return adminRepository.updateUserManager(userId, null);
  }

  if (managerId === userId) {
    throw new Error("Un utilisateur ne peut pas être son propre manager");
  }

  const manager = await adminRepository.getUserById(managerId);

  if (!manager) {
    throw new Error("Manager introuvable");
  }

  if (manager.role !== "MANAGER") {
    throw new Error("L'utilisateur choisi n'est pas un manager");
  }

  return adminRepository.updateUserManager(userId, managerId);
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