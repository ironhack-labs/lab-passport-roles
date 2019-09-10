const express = require('express');
const router  = express.Router();
const passport = require('../config/passport')
const {
  getEmployeeSignUpForm,
  getLoginForm,
  getUser,
  logInUser,
  createEmployee,
  getAllEmployees,
  getEmployee
} = require('../controllers/index.controller')
const catchErrors = require('../middlewares/catchErrors')
const checkRole = require('../middlewares/checkRole')
const isLogIn = require('../middlewares/isLogIn')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', getLoginForm)
router.post('/login', passport.authenticate('local'), logInUser)

router.get('/profile', isLogIn, getUser)

router.get('/employees/signup', checkRole('BOSS'), getEmployeeSignUpForm)
router.post('/employees/signup', checkRole('BOSS'), catchErrors(createEmployee))

//router.get('/employees')

module.exports = router;
