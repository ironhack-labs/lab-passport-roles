const express = require('express');
const router = express.Router();

const Course = require("../models/course.model")

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })


/* GET home page */
router.get('/create', checkRole(["Boss", "TA"]), (req, res, next) => {
  res.render('course/create')
});

router.get('/list', checkRole(["Boss", "TA"]), (req, res, next) => {
  Course.find()
    .then(courses => res.render('course/create', courses))

});


router.post('/create', checkRole(["Boss", "TA"]), (req, res, next) => {

  const { name, description } = req.body

  Course.create({ name, description })
    .then(() => {
      res.redirect('/course/list')
    })
    .catch(() => res.render("auth/signup-form", {
      message: "Something went wrong"
    }))

});
module.exports = router;
