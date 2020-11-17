const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10



const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You must log in to be enter!' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'You dont have permission, sorry' })


// login get
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// login post
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

//signup get
router.get('/signup', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))


//signup post

router.post("/signup", (req, res, next) => {

    const { username, name, password, profileImg, description, facebookId, role } = req.body
    
    if (username === "" || name === "" || password === "" || profileImg === "" || description === "" || facebookId === "" || role === "") {
        res.render("auth/signup", { errorMsg: "Fill in all the brackets" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "This user already exists" })
                return
            }
           
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password[1], salt)
            
     
            User.create({ username, name, password: hashPass, profileImg, description, facebookId, role})
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "There was an error" }))
        })
        .catch(error => next(error))
})

router.get('/myprofile', ensureAuthenticated, checkRole(['DEV', 'TA']), (req, res) => res.render('auth/myprofile', { user: req.user }))

router.get('/show', ensureAuthenticated, checkRole(['DEV', 'TA']), (req, res) => {

    User
        .find()
        .then(theUsers => res.render('auth/show', { theUsers }))
        .catch(err => console.log(err))
})



router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router

