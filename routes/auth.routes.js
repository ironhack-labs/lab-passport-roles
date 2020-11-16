const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10



// Sign up GET
router.get("/signup", (req, res) => res.render("auth/signup"))

// Sign up POST
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill all the fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "The user already exists!" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Error!" }))
        })
        .catch(error => next(error))
})




// Log in GET
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Log in POST
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))




// Add new user GET (if you are a BOSS)
router.get("/new", (req, res) => res.render("auth/new"))

// Add new user POST
router.post("/new", (req, res, next) => {

    const { name, username, password, role } = req.body

    if (username === "" || password === "") {
        res.render("auth/new", { errorMsg: "Fill all the fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/new", { errorMsg: "The user already exists!" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ name, username, password: hashPass, role })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/new", { errorMsg: "Error!" }))
        })
        .catch(error => next(error))
})




// Delete User (if you are a BOSS)
router.post('/delete/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

})


// Edit User
// render (GET)
router.get('/edit/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findById(userId)
        .then(theUser => res.render('auth/edit', theUser))
        .catch(err => console.log(err))

})

//edit (POST)
router.post('boss/edit/:user_id', (req, res) => {
    const userId = req.params.user_id
    const { name, username, password: hashPass, role } = req.body


    User
        .findByIdAndUpdate(userId, { name, username, password: hashPass, role })
        .then(() => res.redirect('/'))
        .catch(err => console.log('Error:', err))

})


module.exports = router