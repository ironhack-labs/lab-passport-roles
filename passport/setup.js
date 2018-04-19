const passport = require("passport");

const User = require("../models/user-model");

//function passportSetup(app) {
//console.log("PASSPORT SETUP");
//add properties & methods to the "req" object in routes

//serialize : what information will store in the session ?
passport.serializeUser((userDetails, done) => {
  console.log("SERIALIZE (save to session)");
  //null in the 1st argument means "no errors occurend"
  done(null, userDetails._id);
});

//deserialize : how will we get the full user details ?
passport.deserializeUser((idFromSession, done) => {
  console.log("deSERIALIZE (details from session)");
  User.findById(idFromSession)
    .then(userDetails => {
      //null in the 1st argument tells Passport "no error occured"
      done(null, userDetails);
    })
    .catch(err => {
      done(err);
    });
});

function passportSetup(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    //make "req.user" accessible inside hbs file as "blahUser"
    res.locals.blahUser = req.user;
    next();
  });
}

module.exports = passportSetup;
