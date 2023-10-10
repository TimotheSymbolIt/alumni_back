const { Router } = require('express');
const router = Router();

router.route('/').get(getAllCompagnies);
router.route('/').post(createCompagny);
// auth require

router
  .route('/:id')
  .post(updateCompagny)
  .get(getSingleCompagny)
  .delete(deleteCompagny);
