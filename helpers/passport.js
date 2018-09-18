const passport = require('passport')
const User = require('../models/User')



//local
passport.use(User.createStrategy())

// facebook

// passport.use(new FacebookStrategy({
//   clientID: "296672544462156",
//   clientSecret: "1d22c4616a5e28961cd3141eededd5a4",
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