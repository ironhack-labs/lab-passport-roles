const express = require('express')
const router = express.Router()

const User = require("../models/user.model")


const bcrypt = require("bcrypt")
const bcryptSalt = 10


// Check the logins and roles

const checkLog= (req, res, next) => req.isAuthenticated() ? next() : res.render("course/login", {message: "Log to see more"})

const checkRole = rolesCheck => {
    return (req, res, next) => {

        req.isAuthenticated() && rolesCheck.includes(req.user.role) ? next() : res.render("course/login", {message: "you don't have enough permits to see that"})
    }
}







// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/all-users', checkLog, (req, res, next) => {
    
    User.find()
        .then(allUsers => res.render("course/all-users", { allUsers }))
        .catch(err => next(err))

})


router.get('/users', checkRole(["BOSS"]), (req, res, next) => {
    //FOR SECURITY, THE ROLE BOSS IS NOT SHOW TO AVOID AN ACCIDENTAL DELETE
    User.find({ "role": { $ne: "BOSS" } })
        .then(allUsers => res.render("course/users", { allUsers }))
        .catch(err=> next(err))
   
})

//Add an user
router.get("/users/add", checkRole(["BOSS"]), (req, res, next) => res.render("course/add"))

router.post("/users/add", checkRole(["BOSS"]), (req, res, next) => {
    const {username, name, password, profileImg, description, facebookId, role} = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    
    User.create({ username, name, password: hashPass, profileImg, description, facebookId, role })
        .then(() => res.redirect('/users'))
        .catch(err => next(err))
    
})

//Remove an user
router.post("/users/:user_id/delete", checkRole(["BOSS"]), (req, res, next) => {
    const userId = req.params.user_id

    User.findByIdAndDelete(userId)
        .then(() => res.redirect("/users"))
        .catch(err => next(err))
})


// View the others profile
router.get("/profile", checkLog, (req, res, next) => res.render("course/private-profile", req.user))

router.get("/profile/:user_id", checkLog, (req, res, next) => {
    const userId = req.params.user_id
    
    User.findById(userId)
        .then(foundUser => res.render("course/public-profile", foundUser))
        .catch(err => next(err))
})


//View and edit the own profile
router.get("/profile/:user_id/edit", checkLog, (req, res, next) => res.render("course/edit-profile", req.user))

router.post("/profile/:user_id/edit", checkLog, (req, res, next) => {
    
    const userId = req.params.user_id
    const { username, name,  profileImg, description, facebookId, } = req.body


    User.findByIdAndUpdate(userId, { username, name,  profileImg, description, facebookId,})
        .then(() => res.redirect('/profile'))
        .catch(err => next(err))

})


module.exports = router
