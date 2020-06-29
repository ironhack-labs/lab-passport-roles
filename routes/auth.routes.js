const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// add routes here

//ROLE CHECKER

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')


const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

//RUTA GET DE REGISTRAR

router.get('/signup', checkAuthenticated, checkRole(['BOSS']), (req, res) => {
    
    res.render ('auth/signup')

})
//RUTA GET PARA INCIIAR SESION 
router.get('/login', (req, res) => {

    res.render('auth/login', { "message": req.flash("error") })

})

//RUTA GET DE EMPLEADOS 
router.get('/employeers', checkAuthenticated, checkRole (['BOSS']),(req, res) => { 
    User
        .find()
        .then(allTheUsers => res.render('auth/employeers', { allTheUsers }))
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})
//RUTA GET PARA CAMBIAR ROLE

router.get('/employeers/:id/edit', (req, res) => {
    User
        .findById(req.params.id)
        .then(editMovie => {
            res.render("auth/edit", editMovie)
           
        })
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})
//RUTA GET PARA VER EL PERFIL

router.get('/profile', checkAuthenticated, checkRole(['DEV', 'TA']), (req, res) => {
    User
        .find()
        .then(allTheUsers => res.render('auth/profile', { allTheUsers }))
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})
router.get('/edit/:id/', (req, res) => {
    User
        .findById(req.params.id)
        .then(theUser => {
            res.render("auth/edit", theUser)

        })
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})


//======================================================================================
//RUTA POST DE ELIMINAR EMPLEADO
router.post('/employeers/:id/delete', (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        .then(() => res.redirect('/'))
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})

//RUTA GET PARA VER PERFIL
router.get('/employeers/:id/profile', (req, res) => {
    User
        .findById(req.params.id)
        .then(theUser => res.render('auth/employeProfile', { theUser }))
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })
})

//RUTA POST DE REGISTRAR

router.post("/signup", (req, res) => {

    const { username,name, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMsg: "Rellena los campos, ¡vago!" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "Usuario ya existente" });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({ username, name, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
        .catch(err => console.log("Error!:", err))
})

//RUTA POST PARA EDITAR ROLE

router.post('/employeers/:id', (req, res) => {

    const  role = req.body.role

    User
        .findByIdAndUpdate(req.params.id, { role })
        .then(() => res.redirect('/'))
        .catch(err => {
            console.log("error en la BBDD", err)
            next()
        })

})
//RUTA POST DE INICIAR SESION 

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// Logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router;
