//! route de connexion utilisateurs
const { Router } = require("express");
const router = Router();
const { registerUser, loginUser } = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
