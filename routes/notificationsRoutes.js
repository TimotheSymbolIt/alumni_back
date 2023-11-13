const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
} = require('../middlewares/authenticationMiddleware.js');

const {
  validateNotificationId,
} = require('../middlewares/validationMiddleware.js');

const {
  getAllNotifications,
} = require('../controllers/notificationsControllers.js');

router
  .use(authenticateUser)
  .route('/:id')
  .get(validateNotificationId, getAllNotifications);

module.exports = router;
