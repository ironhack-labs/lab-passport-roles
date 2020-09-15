const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

 // add routes here
router.get("/login", (req, res, next) => res.render("auth/login", {
 "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
       successRedirect: "/",
       failureRedirect: "/login",
       failureFlash: true,
       passReqToCallback: true
}))

//Role checker

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')
 
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

//Ruta de get registrar

router.get('/signup', checkAuthenticated, checkRole['BOSS']), (req, res) => {
    res.render('auth/signup')
}
 
//Ruta get para iniciar Sesion
router.get('/login', (req, res) => {

    res.render('auth/login', { "message": req.flash("error") })

})
 //Ruta get de empleados 

router.get('/employeers', checkAuthenticated, checkRole(['BOSS']), (req, res) => {
     
    User
        .find()
        .then(allTheUsers => res.render('auth/employeers', { allTheUsers }))
        .catch(err => {
            console.log("Error en la BBDD, ", err)
            next()
        })
    
 })



module.exports = router;