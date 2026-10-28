const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updatePassword,
  updateUserRole,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Routes d'authentification publiques
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route privée protégée par token JWT
router.get('/profile', protect, getUserProfile);
router.put('/update-password', protect, updatePassword);

// Route réservée aux administrateurs (JWT valide + rôle admin requis)
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;