const passport = require("passport");

const User = require("../models/user-model");

// Run the code inside these files
// require("./github-strategy");
// require("./google-strategy");


// serialize: what information will we store in the session?
passport.serializeUser((userDetails, done) => {
    console.log("SERIALIZE (save the session");
    // "null" in the 1st position means "no errors occured"
    done(null, userDetails._id);
});

// deserialize: how will we get the full user details?
passport.deserializeUser((idFromSession, done) => {
    console.log("deSERIALIZE (details from session");
    User.findById(idFromSession)
        .then((userDetails) => {
            // "null" in the 1st argument means "no errors occured"
            done(null, userDetails);
        })
        .catch((err) => {
            done(err);
        })
});


function passportSetup (app){
    // add properties & methods to the "req" object in routes
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        // make "req.user" accessible inside hbs files as "blahUser"
        res.locals.blahUser = req.user;
        next();
    });
};

module.exports = passportSetup;

