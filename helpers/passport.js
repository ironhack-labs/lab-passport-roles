const passport = require('passport')
const User = require('../models/User')
// const FacebookStrategy = require('passport-facebook').Strategy



//local
passport.use(User.createStrategy())
// //facebook
// passport.use(new FacebookStrategy({
//   clientID: "",
//   clientSecret: "",
//   callbackURL:"http://localhost:3000/auth/facebook/"
// },(accessToken, refreshToken, profile, cb)=>{
//   User.create({username:profile.displayName},function(err, user){
//     if(err)return cb(err)
//     cb(null, user)
//   })
// }))


//serialize
passport.serializeUser(function(user, cb){
  cb(null, user)
})
//deserialize

passport.deserializeUser(function(user, cb){
  cb(null, user)
})

module.exports = passport
