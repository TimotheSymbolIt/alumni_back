// //! routes des utilisateurs
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  getAllUsers,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('../controllers/UsersController');

const {
  validateUserParams,
  validateUpdateUserInput,
} = require('../middlewares/validationMiddleware.js');

router.route('/').get(getAllUsers);

router
  .use(authenticateUser)
  .route('/activation')
  .get(authorizePermissions('admin', 'moderator'), getAllInactiveUsers);

router
  .use(authenticateUser)
  .route('/activation/:id')
  .put(
    authorizePermissions('admin', 'moderator'),
    validateUserParams,
    updateActivationUser
  );

router
  .use(authenticateUser)
  .route('/:id')
  .get(getSingleUser)
  .put([validateUserParams, validateUpdateUserInput], updateUser)
  .delete(validateUserParams, deleteUser);

module.exports = router;
