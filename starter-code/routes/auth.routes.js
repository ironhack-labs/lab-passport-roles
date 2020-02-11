const express = require("express");
const router = express.Router();

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");


const checkBoss = user => user.role === "BOSS"

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
  roleErrorMessage: `No tienes accesso a esta pagina`
})

const checkOwnProfile =

  /* GET home page */
  router.get("/login", (req, res, next) => {
    res.render("login", {
      errorMessage: req.flash("error")
    });
  });


router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;


router.get("/staff", (req, res, next) => {

  User.find()
    .then(allcrew => {
      res.render("staff", {
        crew: allcrew,
        isBoss: checkBoss(req.user),
        loggedUserId: req.user._id
      })
    })
    .catch(err => console.log("error al mostrar al staff tipo ", err))
});

router.get("/staff/add-staff", checkRole(["BOSS"]), (req, res) => res.render("add-staff"))


router.post("/staff/add-staff", checkRole(["BOSS"]), (req, res) => {

  const {
    username,
    role,
    password
  } = req.body

  if (username === "" || password === "" || role === "") {
    res.render("add-staff", {
      errorMessage: "Fill all the fields"
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("add-staff", {
          errorMessage: "user alreasy exist"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          role,
          password: hashPass
        })
        .then(() => res.redirect('/staff'))
        .catch(() => res.render("add-staff", {
          errorMessage: "Something went wrong"
        }))
    })
    .catch(error => next(error))
})

router.get("/staff/delete/:id", (req, res) => {

  const {
    id
  } = req.params

  User.findByIdAndDelete(id)
    .then(deletedUser => {
      console.log(deletedUser)
    })
    .then(() => User.find())
    .then(allStaff => res.render("staff", {
      crew: allStaff
    }))
    .catch(err => console.log("there was an error deleting a user ", err))
})


router.get("/staff/edit-staff/:id", (req, res) => {

  const {
    id
  } = req.params

  User.findById(id)
    .then(loggedUser => res.render("edit-staff", loggedUser))
    .catch(err => console.log("there was an error loading the edit view type", err))
})


router.post("/staff/edit-staff/", (req, res) => {

  const {
    username,
    role,
    password
  } = req.body

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.findByIdAndUpdate(req.user._id, {
      username,
      role,
      password: hashPass,
    })
    .then(updatedUser => {
      console.log(updatedUser)
      res.redirect("/staff")
    })

})