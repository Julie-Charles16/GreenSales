const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const {
  hashPassword,
  comparePassword,
} = require('../services/authService');


// ======================
// UPDATE USER
// ======================
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pseudo, email } = req.body;

    // vérifier email unique
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        pseudo,
        email,
      },
    });

    res.json({
      message: "Utilisateur mis à jour",
      user: {
        id: updatedUser.id,
        pseudo: updatedUser.pseudo,
        email: updatedUser.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ======================
// UPDATE PASSWORD
// ======================
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 🔐 vérifier ancien mot de passe
    const isValid = await comparePassword(oldPassword, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    // 🔐 hash nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Mot de passe mis à jour" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// DELETE ACCOUNT
// ======================
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 🔐 vérifier mot de passe
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // 🧹 supprimer relations (ordre important Prisma)
    await prisma.sale.deleteMany({ where: { userId } });
    await prisma.appointment.deleteMany({ where: { userId } });
    await prisma.client.deleteMany({ where: { userId } });

    // 🗑️ supprimer user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Compte supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};