const User = require('../models/User');
const passport = require('../config/passport');
const ensureLogin = require('connect-ensure-login');


exports.getHome = ('/', (req, res, next) => {
  res.render('index');
});

exports.createEmployeeForm = ('/create', (req, res, next) => {
  res.render('create');
});

exports.createEmployee = ('/create', async (req, res, next) => {
  const {username} = req.body;
  const user = await User.create({username, password: req.body.password});
  res.redirect('/employees')
});

exports.getLogin = ('/login', (req, res, next) => {
  res.render('login');
});


exports.postLogin = ('/login', passport.authenticate('local'), (req, res, next) => {
  console.log(req.user, req.session);
  res.redirect('/employees');
});

exports.getEmployees = ('/employees', isLoggedIn, async (req, res, next) => {
  console.log(req.user)
  const users = await User.find()
  res.render('employees', { users })
})

function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()){
    next();
  } else{
    res. redirect('/login');
  }
}

