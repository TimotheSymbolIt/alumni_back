//! routes des compétences

const { Router } = require('express');
const router = Router();

const {
  createStack,
  getSingleStack,
  getAllStacks,
  updateStack,
  deleteStack,
  deleteUserStack,
  addUserStack,
  getUserAllStacks,
} = require('../controllers/stacksControllers');

router.route('/').get(getAllStacks);

router.route('/id').get(getSingleStack);

//! auth require
router
  .route('/user')
  .post(addUserStack)
  .get(getUserAllStacks)
  .delete(deleteUserStack);

// route moderation
router.route('/edit').post(createStack).put(updateStack).delete(deleteStack);
//

module.exports = router;
