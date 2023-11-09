// //! routes des utilisateurs
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  getAllUsers,
  getCurrentUser,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMentoringUser,
} = require('../controllers/usersController.js');

const {
  validateUpdateUserInput,
  validateUserId,
  validateUserDelete,
} = require('../middlewares/validationMiddleware.js');

// afficher tous les utilisateurs
router.route('/').get(getAllUsers);

// afficher l'utilisateur connecté
router.use(authenticateUser).route('/currentUser').get(getCurrentUser);

// afficher un utilisateur
router.route('/user/:id').get(validateUserId, getSingleUser);

// update activation user
router
  .use(authenticateUser)
  .route('/activation')
  .get(authorizePermissions('admin', 'moderator'), getAllInactiveUsers)
  .put(authorizePermissions('admin', 'moderator'), updateActivationUser);

// editer un utilisateur
router
  .use(authenticateUser)
  .route('/edit/:id')
  .put(validateUpdateUserInput, updateUser)
  .delete(validateUserDelete, deleteUser);

// devenir mentor pour un utilisateur
router.use(authenticateUser).route('/mentoring').put(updateMentoringUser);

module.exports = router;
