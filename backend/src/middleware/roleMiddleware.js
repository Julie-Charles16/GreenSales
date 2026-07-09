function authorize(...roles) {
  return (req, res, next) => {
    // Vérifie que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    // Vérifie que son rôle est autorisé
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

    next();
  };
}

module.exports = authorize;