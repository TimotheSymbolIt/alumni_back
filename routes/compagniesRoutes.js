const { Router } = require('express');
const router = Router();

const {
  getAllCompagnies,
  getALLInactiveCompagnies,
  updateActivationCompagnies,
  updateCompagny,
  deleteCompagny,
  CreateCompagny,
} = require('../controllers/compagniesControllers');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateCompagnyInput,
} = require('../middlewares/validationMiddleware.js');

//!Route utilisable sans connexion
router.route('/').get(getAllCompagnies);

//! Route utilisable par  un recruteur ou admin

// Création d'une entreprise
router
  .use(authenticateUser)
  .route('/compagny')
  .post(
    authorizePermissions('admin', 'moderator', 'recrutor'),
    validateCompagnyInput,
    CreateCompagny
  );

// Mise a jour d'une entreprise
router
  .use(authenticateUser)
  .route('/compagny')
  .put(
    authorizePermissions('admin', 'moderator', 'recrutor'),
    validateCompagnyInput,
    updateCompagny
  );
// supprimer une entreprise
router
  .use(authenticateUser)
  .route('/compagny')
  .delete(
    authorizePermissions('admin', 'moderator', 'recrutor'),
    deleteCompagny
  );
// Voir les compagnies inactives
router
  .use(authenticateUser)
  .route('/compagny/activation')
  .get(authorizePermissions('admin', 'moderator'), getALLInactiveCompagnies);

// activation des compagnies inactives

router
  .use(authenticateUser)
  .route('/compagny/activation')
  .put(authorizePermissions('admin', 'moderator'), updateActivationCompagnies);

module.exports = router;
