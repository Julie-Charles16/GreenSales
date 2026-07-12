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


module.exports = {
  getAllUsers,
};