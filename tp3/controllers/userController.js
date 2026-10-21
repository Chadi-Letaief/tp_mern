const User = require('../models/userModel') ;

const createUser = async(req, res) => {
    try {
        const { name, email, age, role } = req.body; 
        if (!name || !email) {
            return res.status(400).json({ message: "Le nom et l'email sont requis" });
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }
        const newUser = await User.create({ name, email, age, role });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (err) {
        if (err.name === 'CastError') {
        return res.status(400).json({
            message: "Identifiant de ressource invalide (format ObjectId attendu)"
        });
        }
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID utilisateur invalide" });
    }

    const hasArticles = await Article.findOne({ author: id });
    if (hasArticles) {
      return res.status(400).json({
        message: "Impossible de supprimer un utilisateur ayant des articles publies"
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

   if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      user: deletedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};
