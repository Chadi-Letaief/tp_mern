const { estNonVide, estEmailValide } = require('../utils/validators');

let users = [
  { id: 1, name: 'Mahmoud', email: 'mahmoud@gmail.com', role: "admin" },
  { id: 2, name: 'Salma', email: 'salma@gmail.com', role: "user" }
];

let prochainId = 3;

const getAllUsers = (req, res) => {
    const { role } = req.query;
    let resultat = users;
    if (role) {
        resultat = users.filter(u => u.role === role);
    }
    res.status(200).json({ total: resultat.length, users: resultat });

};

const getUserById = (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ message: `User ${id} non trouvé` });
    }
    res.status(200).json(user);
};

const createUser = (req, res) => {
    const { name, email, role } = req.body; 
    if (!estNonVide(name) || !estNonVide(email) || !estNonVide(role)) {
        return res.status(400).json({ message: "Le nom, l'email et le rôle sont obligatoires" });
    }
    if (!estEmailValide(email)) {
        return res.status(400).json({ message: "L'adresse email est invalide (doit contenir '@' et '.')." });
    }
    const nouvelUser = { id: prochainId, name: name, email: email, role: role };
    users.push(nouvelUser);
    res.status(201).json({ message: 'User créé', user: nouvelUser });
};

const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    const userExiste = users.some(u => u.id === id);
    if (!userExiste) {
        return res.status(404).json({ message: `Impossible de supprimer: User ${id} introuvable` });
    }
    users = users.filter(u => u.id !== id);
    res.status(200).json({ message: `User ${id} supprimé avec succès` });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};
