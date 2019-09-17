const express = require("express");
const rolesPassport = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const secure = require('../middlewares/secure.min'); 

const bcryptSalt = 10;

//const ensureLogin = require("connect-ensure-login");




rolesPassport.get("/signup", (req, res) => {
  res.render("signup")
})

rolesPassport.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const role = req.body.role
  if (username === "" || password === "") {

    res.render("signup", {
      message: "please indicate username and password"
    })
    return
  }

  User.findOne({
      username
    })
    .then((user) => {
      if (user) {
        res.render("signup", {
          message: "Username alrady exist"
        })
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      })

      newUser.save()
        .then(() => res.redirect("/"))
        .catch(error => next(error))

    })
    .catch(error => next(error))
})

rolesPassport.get("/login", (req, res, next) => {
  res.render("login")
})

rolesPassport.post("/login", passport.authenticate('local-auth', {
  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}))

//admin boss
rolesPassport.get('/bossAdmin', secure.checkRole('Boss'), (req, res, next) => {
  User.find()
    .select({
      username: 1
    })
    .then(allUsers => {
      res.render('bossAdmin', {
        allUsers
      });
    })
});

rolesPassport.post("/bossAdmin", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  }).then(createdUser => {
    res.redirect("bossAdmin")
  }).catch((err) => console.log(err))
})

rolesPassport.post("/:id/delete", (req, res) => {
  User.findByIdAndDelete(req.params.id).then(() => {
    res.redirect("/bossAdmin");
  }).catch((err) => console.log(err))
})

//employee
rolesPassport.get('/employees', secure.checkRole('TA'), (req, res, next) => {
  User.find()
    .select({
      username: 1
    })
    .then(allUsers => {
      console.log(allUsers)
      res.render('employees', {
        allUsers
      });
    })
});

rolesPassport.get("/:id/", (req, res) => {
 User.findById(req.params.id).then(oneUser => {
    res.render("employees-detail", {
      oneUser
    })
  })
})

rolesPassport.get("/:id/edit-profile", (req, res) => {
  User.findById(req.params.id)
    .then(thisUser => {
      res.render("edit-profile", {
        thisUser
      })
    })
    .catch(err => console.log(err))
})

rolesPassport.post("/:id/edit-profile", (req, res) => {
  User.findByIdAndUpdate(req.params._id,{
    new: true
  }).then(updateMyUser => {
    res.redirect("employees")
  }).catch((err) => console.log(err))
});






module.exports = rolesPassport;