const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const passport = require('../config/passport');
const checkRole = require('../middlewares/checkRole');
const catchError = require('../middlewares/catchError')

const {getHome, getLogin, createEmployeeForm, createEmployee, login, postLogin,
  getEmployees} = require('../controllers/index')

router.get('/', getHome);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/create', createEmployeeForm);
router.post('/create', checkRole('BOSS'), catchError(createEmployee));
router.get('/employees', getEmployees);

module.exports = router;
