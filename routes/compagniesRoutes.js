const { Router } = require('express');
const router = Router();

const {
  getSingleCompagny,
  getAllCompagnies,
  getAllInactiveCompagnies,
  updateActivationCompagnies,
  updateCompagny,
  deleteCompagny,
  createCompagny,
} = require('../controllers/compagniesControllers');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateCompagnyInput,
  validateIdCompagnyParams,
} = require('../middlewares/validationMiddleware.js');

//!Route utilisable sans connexion
router.route('/').get(getAllCompagnies);

//! Route utilisable avec une connexion
// Récuperation d'une entreprise
router.use(authenticateUser).route('/:id').get(getSingleCompagny);

//! Route utilisable par  un recruteur ou admin

// Création d'une entreprise
router
  .use(authenticateUser)
  .route('/edit')
  .post(
    authorizePermissions('admin', 'moderator', 'recrutor'),
    validateCompagnyInput,
    createCompagny
  );
// Mise a jour d'une entreprise
router
  .use(authenticateUser)
  .route('/edit')
  .put(
    authorizePermissions('admin', 'moderator'),
    validateCompagnyInput,
    updateCompagny
  );
// supprimer une entreprise
router
  .use(authenticateUser)
  .route('/edit')
  .delete(authorizePermissions('admin', 'moderator'), deleteCompagny);
// Voir les compagnies inactives
router
  .use(authenticateUser)
  .route('/compagny/activation')
  .get(authorizePermissions('admin', 'moderator'), getAllInactiveCompagnies);

// activation des compagnies inactives
router
  .use(authenticateUser)
  .route('/compagny/activation')
  .put(authorizePermissions('admin', 'moderator'), updateActivationCompagnies);

module.exports = router;
