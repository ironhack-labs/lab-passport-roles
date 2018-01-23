const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const secure = require('../configs/passport.config');

router.get('/profile/:id', secure.isAuthenticated, userController.profileId);
router.post('/update', secure.isAuthenticated, userController.update);
// router.get('/show', secure.checkRole("ADMIN"), userController.show);
router.get('/show', secure.isAuthenticated, userController.show);

module.exports = router;