//! Route evenement
const { Router } = require('express');
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

const {
  getAllEvents,
  getAllInactiveEvents,
  updateActivationEvent,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventsControllers.js');

const {
  validateEventInput,
} = require('../middlewares/validationMiddleware.js');

// afficher tous les events
router.route('/').get(getAllEvents);

// afficher un event
router.route('/:id').get(getSingleEvent);

// update activation event
router
  .use(authenticateUser, authorizePermissions('admin', 'moderator'))
  .route('/activation')
  .get(getAllInactiveEvents)
  .put(updateActivationEvent);

// editer un event
router
  .use(authenticateUser, authorizePermissions('admin', 'moderator'))
  .route('/edit')
  .post(validateEventInput, createEvent)
  .put(validateEventInput, updateEvent)
  .delete(deleteEvent);

module.exports = router;
