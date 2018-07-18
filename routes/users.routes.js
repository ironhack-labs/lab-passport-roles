const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const middleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

router.get('/list', middleware.auth, userController.list);
router.get('/confirm', middleware.notAuth, userController.confirm);
router.get('/create', userController.create);
router.post('/create', userController.doCreate);
router.get('/create/user', middleware.checkRole(constants.users.BOSS), userController.createUser);
router.post('/create/user', middleware.checkRole(constants.users.BOSS), userController.doCreateUser);
router.get('/:id', middleware.auth, userController.profile); //REPETIDA ? 
router.get('/:id/edit', middleware.auth, middleware.isOwneredBySessionUser, userController.update);
router.post('/:id/edit', middleware.auth, userController.doUpdate);
router.post('/:id/delete', middleware.auth, middleware.checkRole(constants.users.BOSS), userController.doDelete);
router.post('/:idUser/:idCourse/addDev', middleware.auth, middleware.checkRole(constants.users.DEVELOPER), userController.inscribirme);
router.get('/', middleware.auth, userController.profile); 

module.exports = router;









