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
} = require('../controllers/stacksControllers');

const {
  authenticateUser,
  authorizePermissions,
  validateUserParams,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateStackInput,
} = require('../middlewares/validationMiddleware.js');

// afficher toute les stacks de BDD
router.route('/').get(getAllStacks);

// ajouter un stack a un utlisateur
router
  .use(authenticateUser)
  .route('/user')
  .post(validateUserParams, addUserStack)
  .delete(validateUserParams, deleteUserStack);

// editer un stack
router
  .use(authenticateUser, authorizePermissions('admin', 'moderator'))
  .route('/edit')
  .post(validateStackInput, createStack)
  .put(validateStackInput, updateStack)
  .delete(deleteStack);

module.exports = router;
