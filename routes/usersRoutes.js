const { Router } = require("express");
const router = Router();

const {
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,
} = require("../controllers/usersController.js");

// Afficher tous les utilisateurs
router.route("/").get(getAllUsers);

// Afficher un utilisateur
router.route("/:id").get(getUserById);

// Editer un utilisateur
router.route("/:id").put(updateUserById);

// Supprimer un utilisateur
router.route("/:id").delete(deleteUserById);

module.exports = router;
