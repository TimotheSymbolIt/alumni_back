//! route de connexion utilisateurs
const { Router } = require('express');
const router = Router();

const { registerUser, loginUser } = require('../controllers/authControllers');
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

module.exports = router;
