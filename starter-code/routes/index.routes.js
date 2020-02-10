const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport")

const User = require("../models/user.model")

const checkRoles = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.redirect("index", { roleError: "Necesitas privilegios" })

router.get('/', (req, res, next) => res.render('index', {
  boss: checkRoles(["Boss"])
}))

router.get("/add", checkRoles(["Boss"]), (req, res) => res.render("boss/add"))
router.post("/add", checkRoles(["Boss"]), (req, res) => {
  const {
    name,
    password
  } = req.body

  if (!name || !password)
  {
    res.render("add", {
      message: "Fill up the fields"
    })
  }

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({
    name, password: hashPass
  })
    .then(x => redirect("/"))
    .catch(err => res.render("add", {
      message: "Something went wrong"
    }))

})

router.get("/login", (req, res) => res.render("login", { message: req.flash("error") }))
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true,
  passReqToCallback: true
}))


router.get("/remove", checkRoles(["Boss"]), (req, res) => {
  User.find()
    .then(users => res.render("remove", { users }))

})

router.post("/remove/:id", checkRoles("Boss"), (req, res) => {
  User.findByIdAndDelete(req.params)
    .then(x => res.redirect("/remove"))
    .catch(err => console.log("An erro have occurred: ", err))
})

module.exports = router;