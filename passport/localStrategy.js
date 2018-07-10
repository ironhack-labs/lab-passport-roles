const Employee = require('../models/employee');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy((username, password, done) =>  {

    Employee.findOne({username})
    .then(user => {
        if(!user) throw new Error('Username not found');
        if(!bcrypt.compareSync(password, user.password)) throw new Error("Password doesn't fit")

        return done(null, user);
    })
    .catch(err => {
        return done(null, false, {message: err.message})
    })

}))