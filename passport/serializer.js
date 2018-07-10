const Employee = require('../models/employee');
const passport = require('passport');

passport.serializeUser((user, callback) => {
    callback(null, user._id);
})

passport.deserializeUser((id, callback) => {
    Employee.findById(id)
    .then(user => {
        callback(null, user);
    })
    .catch(callback);
})