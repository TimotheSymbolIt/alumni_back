// //! route des formations

const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateTrainingInput,
} = require('../middlewares/validationMiddleware.js');

const {
  getAllTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
} = require('../controllers/trainingsControllers');

router.route('/').get(getAllTrainings);

router
  .use(authenticateUser)
  .use(authorizePermissions('admin', 'moderator'))
  .route('/edit')
  .post(validateTrainingInput, createTraining)
  .put(validateTrainingInput, updateTraining)
  .delete(deleteTraining);

module.exports = router;
