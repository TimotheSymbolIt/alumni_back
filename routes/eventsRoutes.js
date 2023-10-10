//! Route evenement
const { Router } = require('express');
const router = Router();

router.route('/').get(getAllEvents);
// auth require

router.route('/').post(createEvent);

router.route('/:id').post(updateEvent).get(getSingleEvent).delete(deleteEvent);
