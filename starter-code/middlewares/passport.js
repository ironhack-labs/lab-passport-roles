const passport = require('passport')
const localStrategy = require('passport-local').localStrategy
const Admin = require('../models/Admin')
const slackStrategy = require('passport-slack').Strategy

passport.use(Admin.createStrategy())

passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())

passport.use(new slackStrategy({
  clientID: process.env.SLACK_ID,
  clientSecret: process.env.SLACK_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {

    const user = await Admin.findOne({
      slackID: profile.id
    })
    if (user) {
      return done(null, user)
    }
    const newUser = await Admin.create({
      username: profile.displayName,
      slackID: profile.id
    })
    done(null, newUser)
  } catch (err) {
    return done(err)
  }
}))

module.exports = passport