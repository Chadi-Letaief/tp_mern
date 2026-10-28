const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      return next();
    } catch (err) {
      // 2. Gestion spécifique du jeton expiré
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ message: 'Votre session a expiré, veuillez vous reconnecter' });
      }

      // Autres erreurs de validation du token ( signature invalide, jeton altéré, etc.)
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};

module.exports = { protect };