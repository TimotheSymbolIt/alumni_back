//! route de connexion utilisateurs
const { Router } = require('express');
const router = Router();
const {
  validateLoginInput,
  validateRegisterInput,
} = require('../middlewares/validationMiddleware.js');
const { registerUser, loginUser } = require('../controllers/authControllers');

router.post('/registerUser', validateRegisterInput, registerUser);
router.post('/loginUser', validateLoginInput, loginUser);

module.exports = router;
