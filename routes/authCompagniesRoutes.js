const { Router } = require('express');
const router = Router();

router.post('/registerCompagny', registerCompagny);
router.post('/loginCompagny', loginCompagny);

module.exports = router;
