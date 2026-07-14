const prisma = require("../config/db");

const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      pseudo: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

const updateUserRole = (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      pseudo: true,
      email: true,
      role: true,
    },
  });
};

const deleteUser = (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};