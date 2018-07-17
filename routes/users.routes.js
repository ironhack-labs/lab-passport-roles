const express = require('express');
const router = express.Router();
const controllerRoutes = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const constants = require('../constants');

router.get('/list', authMiddleware.auth, controllerRoutes.list); 
router.get('/', authMiddleware.auth, controllerRoutes.profile); 
router.get('/create',  controllerRoutes.create);
router.post('/create', controllerRoutes.doCreate);
router.post('/create', controllerRoutes.doCreate);
router.get('/create/admin', authMiddleware.checkRole(constants.BOSS), controllerRoutes.createUser);
router.post('/create/admin', authMiddleware.checkRole(constants.BOSS), controllerRoutes.doCreateUser);
router.get('/:id/edit', authMiddleware.auth, controllerRoutes.update);
router.post('/:id/edit', authMiddleware.auth, controllerRoutes.doUpdate);
router.get('/:id', authMiddleware.auth, controllerRoutes.profile);
router.post('/:id/delete', authMiddleware.auth, authMiddleware.checkRole(constants.BOSS), controllerRoutes.doDelete);

module.exports = router;








