// //! routes des utilisateurs
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
  validateUserParams,
} = require('../middlewares/authenticationMiddleware.js');

const {
  getAllUsers,
  getCurrentUser,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('../controllers/UsersController');

const {
  validateUpdateUserInput,
} = require('../middlewares/validationMiddleware.js');

// afficher tous les utilisateurs
router.route('/').get(getAllUsers);

// afficher l'utilisateur connecté
router.use(authenticateUser).route('/currentUser').get(getCurrentUser);

// afficher un utilisateur
router.route('/user/:id').get(getSingleUser);

// update activation user
router
  .use(authenticateUser, authorizePermissions('admin', 'moderator'))
  .route('/activation')
  .get(getAllInactiveUsers)
  .put(updateActivationUser);

// editer un utilisateur
router
  .use(authenticateUser)
  .route('/edit')
  .put([validateUserParams, validateUpdateUserInput], updateUser)
  .delete(validateUserParams, deleteUser);

module.exports = router;
