//! routes des compétences

const { Router } = require('express');
const router = Router();

const {
  createStack,
  getAllStacks,
  updateStack,
  deleteStack,
  deleteUserStack,
  addUserStack,
  getUserAllStacks,
} = require('../controllers/stacksControllers');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateUserParams,
  validateStackInput,
} = require('../middlewares/validationMiddleware.js');
//! route utilisable sans connexion
// afficher toute les stacks de BDD
router.route('/').get(getAllStacks);

router.route('/:id').get(getUserAllStacks);

//! route utilisable par un membre connecté

// ajouter un stack a un utlisateur
router
  .use(authenticateUser)
  .route('/user/:id')
  .post(validateUserParams, addUserStack);
// supprimer un stack d'un utilisateur
router
  .use(authenticateUser)
  .route('/user/:id')
  .delete(validateUserParams, deleteUserStack);

//! route moderation
// creation d'un stack
router
  .use(authenticateUser)
  .route('/edit')
  .post(
    authorizePermissions('admin', 'moderator'),
    validateStackInput,
    createStack
  );
// modification d'un stack
router
  .use(authenticateUser)
  .route('/edit')
  .put(
    authorizePermissions('admin', 'moderator'),
    validateStackInput,
    updateStack
  );
// supprimer un stack
router
  .use(authenticateUser)
  .route('/edit')
  .delete(authorizePermissions('admin', 'moderator'), deleteStack);

module.exports = router;
