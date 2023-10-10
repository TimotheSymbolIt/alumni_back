//! routes des offres emplois
const { Router } = require('express');
const router = Router();

router.route('/').post(createUser);

router.route('/').get(getAllUsers);

// auth require
router.route('/:id').get(getSingleUser).post(updateUser).delete(deleteUser);
