const passport = require("passport")
const User = require ('../models/user-model')


// serialize: what information will we store in the session
passport.serializeUser((userDetails, done) => {
  // "nul" in the 1st argument means "no errors occured"
  done(null, userDetails._id)

})
// deserialized: how we will get the full user details?
passport.deserializeUser((idFromSession, done) => {
  User.findById(idFromSession)
    .then(data => {
        // "null" in the 1st argument means "no errors occured"
        done(null, data);
    })
    .catch(err => {
      done(err)
    });
})
function passportSetup (app){
  // add  properties & methodes to the "req" onbject in routes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    //make req.user" accessible inside hbs files a "blahUser
    res.locals.blahUser = req.user;
    next();
  })
}

module.exports = passportSetup