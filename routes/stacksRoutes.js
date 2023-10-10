const { Router } = require('express');
const router = Router();

router.route('/').get(getAllStacks);

// auth require
router.route('/').post(createStack);
router.route('/:id').post(updateStack).get(getSingleStack).delete(deleteStack);
