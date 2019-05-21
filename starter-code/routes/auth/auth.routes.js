const express = require('express')
const auth = express.Router()
const passport = require('passport')
const User = require('../../models/user.models')
const bcrypt = require("bcrypt")
const bcryptSalt = 10



// signup 
auth.get('/signup', (req, res) => res.render('user/signup'))

auth.post('/signup', (req, res, next) => {

    const { username, password, role } = req.body

    if (!username || !password || !role) {
        res.render("user/signup", { msg: 'Rellena todos los campos' })
        return
    }
    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('user/signup', { message: 'El usuario ya existe' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            const newUser = new User({
                username,
                password: hashPass,
                role,
            })

            newUser.save()
                .then(x => res.redirect("/"))
                .catch(err => res.render("/user/signup", { message: `Hubo un error: ${err}` }))
        })
})

// login 
auth.get('/login', (req, res, next) => {
    res.render('user/login', { "msg": req.flash("error") })
})

auth.post('/login', passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: "/user/login",
    failureFlash: true,
    passReqToCallback: true
}))

//Logout

auth.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

// Add User
auth.get('/add-user', (req, res) => res.render('user/add-user'))

auth.post('/add-user', (req, res) => {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
        res.render("user/add-user", { msg: 'Rellena todos los campos' })
        return
    }
    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('user/add-user', { msg: 'El usuario ya existe' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            const newUser = new User({
                username,
                password: hashPass,
                role,
            })

            newUser.save()
                .then(x => res.redirect("/"))
                .catch(err => res.render("/user/add-user", { msg: `Hubo un error: ${err}` }))
        })

})

// User List 

auth.get('/list/boss', bossAdminAuth, (req, res) => {
    User.find()
        .then(allUsers => {
            res.render('user/user-list-edit', { users: allUsers })
        })  // ESTO ES LA VISTA
        .catch(error => console.log(error))
})

auth.get('/list/developer', developerAuth, (req, res) => {
    User.find()
        .then(allUsers => {
            res.render('user/user-list', { users: allUsers })
        })  // ESTO ES LA VISTA
        .catch(error => console.log(error))
})

function bossAdminAuth(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Boss') {
        return next();
    } else {
        res.redirect('/user/login')
    }
}
function developerAuth(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Developer') {
        return next();
    } else {
        res.redirect('/user/login')
    }
}

// Deletes user

auth.post('/list/delete/:_id', bossAdminAuth, (req, res, next) => {
    const id = req.params._id
    User.findById(id).remove()
        .then(removed => {
            console.log('Usuario borrado', removed)
            res.redirect('/user/list/boss')
        })
        .catch(err => console.log("Fallo en borrar usuario", err))
})

//Edit user

auth.get('/list/edit/:_id', (req, res, next) => {

    const id = req.params._id

    User.findById(id)
        .then(users => res.render('user/edit-user', { user: users }))
        .catch(error => console.log(error))

})

auth.post('/list/edit/:_id', (req, res, next) => {
    const { username, password, role } = req.body
    const id = req.params._id
    User.findByIdAndUpdate(id, { username, password, role }, { new: true })
        .then(update => {
            console.log('Usuario actualizado', update)
            res.redirect('/user/list/boss')
        })
        .catch(err => console.log('No se actualizo actor', err))

})






module.exports = auth