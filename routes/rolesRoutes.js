const { Router } = require('express');
const router = Router();

router.route('/').get(getAllRoles);

// auth require
router.route('/').post(createRole);
router.route('/:id').post(updateRole).get(getSingleRole).delete(deleteRole);
