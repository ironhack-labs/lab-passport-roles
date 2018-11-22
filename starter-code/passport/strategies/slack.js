const SlackStrategy = require('passport-slack').Strategy;
const passport = require('passport');
const User = require('../../models/User');
const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET} = process.env;

console.log(SLACK_CLIENT_ID, SLACK_CLIENT_SECRET);
// setup the strategy using defaults
passport.use(new SlackStrategy({
    clientID: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    // optionally persist profile data
    const slackId = profile.id;
    User.findOne({slack_id: slackId}, (err, user) => {
      if (user) {
        return done(null, user);
      } else {
        const u = new User({username:profile.user.name, slack_id:profile.user.id})
        u.save().then(user => {
          console.log("READY USER");
          done(null, user);
        });
      }
    });
  }
));
