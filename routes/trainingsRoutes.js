//! route des formations
//! routes des offres emplois
const { Router } = require('express');
const router = Router();

router.route('/').get(getAllTrainings);

// auth require
router.route('/').post(createTraining);
router
  .route('/:id')
  .get(getSingleTraining)
  .post(updateTraining)
  .delete(deleteTraining);
