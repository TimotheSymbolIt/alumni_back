//! Route upload d'image
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

// validation de l'image et optimisation via middleware
const { optimizeImage } = require('../middlewares/uploadOptimizer.js');

// controllers
const { postEventImage } = require('../controllers/uploadControllers');

router
  .use(authenticateUser)
  .use(authorizePermissions('admin', 'moderator'))
  .route('/event')
  .post(optimizeImage, postEventImage);

// upload d'image
module.exports = router;
