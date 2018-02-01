const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const secure = require('../configs/passport.config');

router.get('/:id', userController.index);
router.get('/:id/profile', secure.isAuthenticated, userController.profile);
router.get('/:id/edit', secure.isMe, userController.edit);
router.post('/:id/edit', secure.isAuthenticated, userController.doEdit);
router.post('/:id/delete', secure.checkRole("BOSS"), userController.delete);

module.exports = router;