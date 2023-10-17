const { Router } = require('express');
const router = Router();

const {
  getSingleCompagny,
  getAllCompagnies,
  getAllInactiveCompagnies,
  updateActivateCompagny,
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
// Selectionner toutes les compagnies
router.route('/').get(getAllCompagnies);

//! Route utilisable avec une connexion
// Récuperation d'une entreprise
router.use(authenticateUser).route('/compagny/:id').get(getSingleCompagny);

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
  .route('/activation')
  .get(authorizePermissions('admin', 'moderator'), getAllInactiveCompagnies);

// activation des compagnies inactives
router
  .use(authenticateUser)
  .route('/activation')
  .put(authorizePermissions('admin', 'moderator'), updateActivateCompagny);

module.exports = router;
