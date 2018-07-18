const express = require('express');
const router = express.Router();
const controllerHelp = require('./../controller/help.controller');
const middleware = require('../middlewares/auth.middleware');

router.get('/create', middleware.auth, controllerHelp.create);
router.post('/create', middleware.auth, controllerHelp.doCreate);

module.exports = router;

