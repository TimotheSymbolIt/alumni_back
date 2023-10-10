//! routes des utilisateurs
const { Router } = require('express');
const router = Router();

router.route('/').get(getAllUsers);

// auth require
router.route('/').post(createUser);
router.route('/:id').get(getSingleUser).update(updateUser).delete(deleteUser);
