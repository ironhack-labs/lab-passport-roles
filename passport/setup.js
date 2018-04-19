const passport = require("passport");

const User = require("../models/user-model");

passport.serializeUser((userDetails, done) => {
  done(null, userDetails._id);
}); 

passport.deserializeUser((idFromSession, done) => {
  User.findById(idFromSession)
    .then(userDetails => {
      done(null, userDetails);
    })
    .catch((err) => {
      done(err);
    });
}); 
function passportSetup(app) {
  // console.log('passport'); --- to be displayed in the terminal, to check
  //if the connection with the app.js works

  //add properties & methods to the req object in routes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next)=>{
      res.locals.theUser = req.user;
      next();
  })
}

module.exports = passportSetup;

