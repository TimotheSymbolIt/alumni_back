//! route de connexion
const { Router } = require('express');
const router = Router();

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

module.exports = router;
