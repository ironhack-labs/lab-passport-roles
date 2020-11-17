
const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('log-in', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('log-in', { errorMsg: 'Desautorizado, no tienes los permisos necesarios' })



//SIGN-UP

router.get("/sign-up", ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('sign-up'))

router.post("/sign-up", ensureAuthenticated, checkRole(['BOSS']),(req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("sign-up", { errorMsg: "El usuario ya existe" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("sign-up", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})


//WELCOME PAGE

router.get("/welcome", (req, res) => res.render("welcome"))

//LOG-OUT PAGE

router.get("/log-out", (req, res) => res.render("log-out"))


//LOG-IN

// Inicio sesión (renderizado formulario)
router.get("/log-in", (req, res) => res.render("log-in",))

// Inicio sesión (gestión)
router.post("/log-in", passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/log-in",
    failureFlash: true,
    passReqToCallback: true
}))


// LOG-OUT
router.get('/log-out', (req, res) => {
    req.logout()
    res.redirect("/log-out")
})



//EMPLOYERS LIST



router.get('/employers', (req, res) => {

    User
        .find()
        .then(allEmployers => res.render('employers/all-employers', { allEmployers }))
        .catch(err => console.log(err))
})

//EMPLOYERS LIST



router.get('/employers/all-employers', (req, res) => {

    User
        .find()
        .then(allEmployers => res.render('boss', { allEmployers }))
        .catch(err => console.log(err))
})


//EMPLOYERS DETAILS



router.get('/all-employers/:employer_id', (req, res) => {

    const employerID = req.params.employer_id

    User
        .findById(employerID)
        .then(employer => res.render('employers/employers-details', employer))
        .catch(err => console.log(err))

})




// DELETE EMPLOYER

router.get('/delete-employers/:employers_id', ensureAuthenticated, checkRole(['BOSS']), (req, res) =>
{
    const employerID = req.params.employers_id
    console.log(employerID)

    User
        .findByIdAndRemove(employerID)
        .then(() => res.redirect('/employers/'))
        .catch(err => console.log(err))
})



// EDIT EMPLOYER


router.get('/edit-employers/:employers_id', ensureAuthenticated, checkRole(['BOSS','DEV','TA']), (req, res) => 
{
    const employerID = req.params.employers_id
  
    User
        .findById(employerID)
        .then(employer => res.render('employers/edit-employers', employer))
        .catch(err => console.log(err))
})



router.post('/employers/edit-employers/:_id', (req, res) => {

    const employerID = req.params._id

    const { username, role } = req.body

    User
        .findByIdAndUpdate(employerID, { username, role  })
        .then(employer => res.render('index'))
        .catch(err => console.log(err))
})

module.exports = router