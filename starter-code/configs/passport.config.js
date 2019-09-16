require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');

passport.serializeUser((employee, cb) => {
  cb(null, employee._id);
});

passport.deserializeUser((id, cb) => {
  Employee.findById(id, (err, employee) => {
    if (err) { return cb(err); }
    cb(null, employee);
  });
});

passport.use('local-auth', new LocalStrategy((username, password, next) => {
  Employee.findOne({ username }, (err, employee) => {
    if (err) {
      return next(err);
    }
    if (!employee) {
      return next(null, false, { message: 'Incorrect username or password' });
    }
    if (!bcrypt.compareSync(password, employee.password)) {
      return next(null, false, { message: 'Incorrect username or password' });
    }

    return next(null, employee);
  });
}));

