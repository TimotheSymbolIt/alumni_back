//! Route upload d'image
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

// validation de l'image et optimisation via middleware
const { optimizeEventImage } = require('../middlewares/uploadOptimizer.js');

// controllers
const { postEventImage } = require('../controllers/uploadControllers');

router
  .use(authenticateUser)
  .use(authorizePermissions('admin', 'moderator'))
  .route('/event')
  .post(optimizeEventImage, postEventImage);

// upload d'image
module.exports = router;
