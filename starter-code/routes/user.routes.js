const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/:id', userController.index);
router.get('/:id/edit', userController.edit);
router.post('/:id/edit', userController.doEdit);
router.get('/:id/delete', userController.delete);
router.post('/:id/delete', userController.doDelete);

module.exports = router;