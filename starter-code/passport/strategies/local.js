
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username })
    .catch(e =>  next(e))
    .then(user => {
      if(!user) throw new Error("Incorrect user");
      return user; 
    })
    .then(user => {
      if(!bcrypt.compareSync(password,user.password)){
        throw new Error("Incorrect password")
      }else{
        next(null, user)
      }
    })
    .catch(e => next(null,false,{message:e.message}))
}));