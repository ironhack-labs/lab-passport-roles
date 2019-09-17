const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const checker = require("../middlewares/checker");

router.get("/employees", checker.checkLogin, (req, res, next) => {
  User.find()
  .select({ username: 1, role: 1 })
  .then(user => {
    return employees = user.filter(employee => employee.role !== "Boss");
  })
  .then(employees => {
    res.render("employees/index", { employees, user: req.user });
  })
});

router.get("/employees/:id", checker.checkLogin, (req, res) => {
  User.findById(req.params.id)
  .select({ username: 1, role: 1, createdAt: 1, _id: 0 })
  .then(user => {
    res.render("employees/detail", { user });
  })
});

router.get("/employees/:id/edit", checker.checkLogin, (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.render("employees/edit", { user });
  })
  .catch(error => next(error));
});

router.post("/employees/:id", checker.checkLogin, (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(req.params.id, { username, password: hashedPassword}, { new: true })
    .then(employee => {
      res.redirect("/private");
    })
    .catch(error => next(error));
});

module.exports = router;