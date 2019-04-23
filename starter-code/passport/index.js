/*
2 ---->>> 

importar:
    1) passport (para loggear usuarios)
    2) modelos
Strategies:
    3) crear strategy
    passport.use(User.createStrategy())
    cb que se ejecuta cuando hay inicio de sesión:
    serialize-->> pone disponible la sesión y la gestiona
    deserialize -->> busca y serializa de la base de datos y después pone disponibe con (req.user)
    //para inicio de sesión con face
    3) estrategia de facebook (passport-facebook)

*/

const passport = require('passport')
const User = require('..models/User')
//const LocalStrategy = require('passport-local').Strategy
//const bcrypt = require('bcrypt')
const FacebookStrategy = require('passport-facebook').Strategy

//local Strategy
passport.use(new localStrategy(async (username, password, next) => {
    try{
        const user = await User.findOne({email})
        if(!user) return next (null, false, {
            message: 'Incorrect username'
        })
        if(!bcrypt.compareSync(password,user.password)) 
        return next(null, false, {
            message : 'Incorrect password'
        })
        return next (null,user) //si no hay ningún error
    } catch (error) {
        return next(error)
    }
}))

//serialize & deserialize 
passport.serializeUser((user,cb) => { //ir a DB y poner el objeto de usuario disponible
    cb(null, user._id) //ejecutar cb de inicio de sesión y poder definir sesión
})

passport.deserializeUser((id,cb) => { //serializa de la DB
    User.findById(id, (err, user) => { //buscar usuario en DB
     if(err) {return cb(err)}
     cb(null, user)
    })
})

//facebook Strategy
passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FBID,
        clientSecret: process.env.FBSECRET,
        callbackURL: 'http://localhost:3000/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOne({ email: profile.emails[0].value })
          .then(doc => {
            if (!doc) {
              User.create({ email: profile.emails[0].value })
                .then(user => {
                  cb(null, user)
                })
                .catch(err => {
                  cb(err, null)
                })
            } else {
              cb(null, doc)
            }
          })
          .catch(err => {
            cb(err, null)
          })
      }
    )
  )
  

module.exports = passport; //trae libraría y la devuelve