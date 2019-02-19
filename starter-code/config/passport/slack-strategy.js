const passport =  require('passport');
const SlackStrategy = require('passport-slack').Strategy;

const User = require('../../models/user');

passport.use(new SlackStrategy({
  clientID    : process.env.slackClientId,
  clientSecret: process.env.slackClientSecret,
  callbackURL : '/slack/callback',
  proxy       : true 
}, ( accessToken, refreshToken, userInfo, cb ) => {
  // console.log('who is this: ', userInfo);
  const {email, name} = userInfo.user; 
  User.findOne({$or: [
     {email: email},
     {slackID: userInfo.user.id}
  ]})
    .then(user =>{
      if(user){
        cb(null, user);
        return;
      }
      User.create({
        email,
        fullName: name,
        slackID: userInfo.user.id
      })
        .then(newUser =>{
          cb(null, newUser);
        })
        .catch(err => next (err))
    })
    .catch(err => next(err))

}))