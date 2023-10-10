const { Router } = require('express');
const router = Router();

router.route('/').get(getAllCompagnies);

// auth require
router.route('/').post(createCompagny);
router
  .route('/:id')
  .get(getSingleCompagny)
  .update(updateCompagny)
  .delete(deleteCompagny);
