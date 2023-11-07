// //! routes des offres emplois
const { Router } = require('express');
const router = Router();

const {
  getAllJobs,
  getSingleJob,
  getAllInactiveJobs,
  updateActivateJob,
  updateJob,
  deleteJob,
  createJob,
} = require('../controllers/jobsControllers');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateJobInput,
  validateJobId,
} = require('../middlewares/validationMiddleware.js');

//!Route utilisable sans connexion
//Selectionner tout les jobs
router.route('/').get(getAllJobs);

//! Route utilisable avec une connexion
// Récuperation d'un job
router.use(authenticateUser, validateJobId).route('/job/:id').get(getSingleJob);

//! Route utilisable par  un recruteur ou admin
// activation des jobs inactives
router
  .use(authenticateUser)
  .route('/activation')
  .put(authorizePermissions('admin', 'moderator'), updateActivateJob);
// Voir les jobs inactives
router
  .use(authenticateUser)
  .route('/activation')
  .get(authorizePermissions('admin', 'moderator'), getAllInactiveJobs);
// Mise a jour d'un job
router
  .use(authenticateUser, validateJobId)
  .route('/edit')
  .put(authorizePermissions('admin', 'moderator'), validateJobInput, updateJob);
// supprimer un job
router
  .use(authenticateUser, validateJobId)
  .route('/edit')
  .delete(authorizePermissions('admin', 'moderator'), deleteJob);
// Création d'un job
router
  .use(authenticateUser)
  .route('/edit')
  .post(
    authorizePermissions('admin', 'moderator', 'recrutor'),
    validateJobInput,
    createJob
  );
module.exports = router;
