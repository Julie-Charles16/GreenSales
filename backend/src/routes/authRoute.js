const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../services/authService");

// 🟢 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { pseudo, email, password } = req.body || {};

    // 🔴 VALIDATION SAFE (évite les erreurs)
    if (
      typeof pseudo !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !pseudo.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        pseudo: pseudo.trim(),
        email: email.trim(),
        password: hashedPassword,
      },
    });

    res.json({
      message: "Utilisateur créé",
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
      },
    });
  } catch (err) {
    console.error(err); // utile pour debug
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

// 🔵 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 🔴 VALIDATION LOGIN
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

module.exports = router;