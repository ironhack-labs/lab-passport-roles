const passport = require("passport")
const session = require("express-session")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")

const User = require("../models/User.model")

module.exports = app => {

    app.use(session({
        secret: `passport-roles-lab`,
        resave: true,
        saveUninitialized: true
    }))

    passport.serializeUser((user, next) => next(null, user._id))
    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(theFoundUser => next(null, theFoundUser))
            .catch(error => next(error))
    })

    app.use(flash())

    passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
        User.findOne({ username })
            .then(theFoundUser => {
                if (!theFoundUser) {
                    return next(null, false, { message: "Incorrect Username" })
                }
                if (!bcrypt.compareSync(password, theFoundUser.password)) {
                    return next(null, false, { message: "Incorrect Password" })
                }
                return next(null, theFoundUser)
            })
            .catch(error => next(error))
    }))

    app.use(passport.initialize())
    app.use(passport.session())

}