const passport = require('passport')
const User = require('../models/User')
const FacebookStrategy = require('passport-facebook')

/*
//Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FID,
  clientSecret: process.env.FSECRET,
  callbackURL: "",
  scope: ["email"]
},
function(accessToken, refreshToken, profile, cb){
  User.findOne({facebookId:profile.id})
  .then(user=>{
    if(user) return cb(null, user)
    return User.create({
      username: profile.displayname,
      email: profile.email,
      facebookId: profile.id
    })
    .then(user=> cb(null, user))
    .catch(e => cb(e))
  })
}
))
*/

//Local
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport
