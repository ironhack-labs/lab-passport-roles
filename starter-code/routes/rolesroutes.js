const express = require('express')
const router = express.Router()
const User = require("../models/usermodel")


// router.get("/", (req, res) => res.render("auth/login-form"))

const checkRole = roles => (req, res, next) => {
  if (req.isAuthenticated() && roles.includes(req.user.role)) {
    return next()
  } else {
    res.render("login", {
      roleErrorMessage: `You need ${roles} para acceder aquí`
    })
  }
}

router.get("/private", checkRole(['Boss']), (req, res) => {
  User.find()
    .then(users => {
      res.render("roles/private", {
        allUsers: users,
        currentUser: req.user.username
      })
    })
})

router.post(`/private/:id/delete`, checkRole(['Boss']), (req, res, next) => {
  User.findByIdAndRemove({
     '_id': req.params.id
  })
    .then(() => {
      res.redirect("/private");
    })
    .catch(() => {
      next();
    });
});


module.exports = router