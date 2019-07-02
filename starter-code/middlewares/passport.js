const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const slackStrategy = require("passport-slack").Strategy;
const User = require("../models/User");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
	new slackStrategy(
		{
			clientID: process.env.SLACK_ID,
			clientSecret: process.env.SLACK_SECRET
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await User.findOne({ slackID: profile.id });

				if (user) return done(null, user)

				const newUser = await User.create({
					username: profile.displayName,
          slackID: profile.id,
          role: 'STUDENT'
				})
				done(null, newUser)
			} catch (err) {
				return done(err);
			}
		}
	)
);

module.exports = passport;
