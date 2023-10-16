//!Route de roles

const { Router } = require('express');
const router = Router();

const { getAllRoles } = require('../controllers/rolesControllers');

const {
  authorizePermissions,
} = require('../middlewares/authenticationMiddleware.js');

router.route('/').get(authorizePermissions('admin', 'moderator'), getAllRoles);

module.exports = router;
