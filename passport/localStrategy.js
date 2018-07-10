const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltWord = process.env.SALT_WORD;

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username })
    .then(user => {
      if (!user) throw new Error("Incorrect Username");
      if (!bcrypt.compareSync(saltWord.concat(password), user.password)) throw new Error("Incorrect Password");

      return next(null, user);
    })
    .catch(e => {
      console.log(e)
      next(null, false, {
        message: e.message
      })
    })
}));

