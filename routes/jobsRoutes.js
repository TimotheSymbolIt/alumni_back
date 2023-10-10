//! routes des offres emplois
const { Router } = require('express');
const router = Router();

router.route('/').get(getAlljobs);

// auth require
router.route('/').post(createjob);
router.route('/:id').get(getSingleJob).update(updateJob).delete(deleteJob);
