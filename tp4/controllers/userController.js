const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Utilitaire de génération de token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// POST /api/users/register (Inscription publique)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation des champs obligatoires
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit comporter au moins 6 caractères",
      });
    }

    // Vérification de l'existence de l'utilisateur
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Un utilisateur existe déjà avec cet email" });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Protection contre l'escalade de privilèges :
    // On force 'role: "user"' explicitement, même si l'attaquant envoie "role": "admin" dans le body
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // ou la fonction de génération de token de votre projet
      });
    } else {
      res.status(400).json({ message: "Données utilisateur invalides" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/login (Connexion)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Identifiants invalides' });
    }

    // Comparaison sécurisée en temps constant
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Identifiants invalides' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/profile (Profil protégé)
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users (Admin uniquement)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/update-password (Renouvellement du mot de passe)
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 2. Validation des champs requis
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "L'ancien et le nouveau mot de passe sont requis",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit comporter au moins 6 caractères",
      });
    }

    // Récupération de l'utilisateur
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 3. Vérification de l'ancien mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Ancien mot de passe incorrect" });
    }

    // 4. Génération d'un nouveau sel, hachage de newPassword et sauvegarde
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Réponse 200 OK avec message de succès
    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/:id/role (Modification de rôle - Admin uniquement)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validation du rôle s'il est transmis dans le body
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide (doit être "user" ou "admin")' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Mise à jour du rôle (par défaut 'admin' si aucun rôle spécifique n'est fourni dans le body)
    user.role = role || 'admin';
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: `Le rôle de l'utilisateur a été mis à jour avec succès : ${user.role}`,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updatePassword,
  updateUserRole,
};