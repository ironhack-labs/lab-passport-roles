const express = require('express');
const router = express.Router();
const controllerCourses = require('../controller/courses.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

router.get('/create', authMiddleware.auth, authMiddleware.checkRole(constants.users.TA), controllerCourses.create);
router.post('/create', authMiddleware.auth, authMiddleware.checkRole(constants.users.TA), controllerCourses.doCreate);
router.get('/list', authMiddleware.auth, controllerCourses.list);
router.post('/:id/delete', controllerCourses.doDelete);

// router.post('/update', controllerCourses, doUpdate);

module.exports = router;
