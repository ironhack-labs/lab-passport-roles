const FbStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../../models/User');
const {FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET} = process.env;

passport.use(new FbStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: "/facebook/callback"
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const facebookId = profile.id;
    User.findOne({facebookID: facebookId}, (err, user) => {
      if (user) {
        return done(null, user);
      } else {
        const u = new User({username:profile.displayName, facebookID:profile.id})
        u.save().then(user => {
          console.log("READY USER");
          done(null, user);
        });
      }
    });
  }
));
