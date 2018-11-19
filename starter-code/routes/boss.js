const express = require("express");
const checkRole = require("../middlewares/checkRoles");
const router = express.Router();
const Employees = require("../models/Users");
const bcrypt = require('bcrypt')


router.get("/", (req, res, next) => {
  Employees.find()
    .then(employee => {
      console.log(employee);
      res.render("userBoss/userBoss", { employee });
    })
    .catch(err => {
      next(err);
    });
});

//////////Crear un nuevo empleado.

router.post("/", (req, res, next) => {
  const hashEmployer = req.body.passwordCreate;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashemployee = bcrypt.hashSync(hashEmployer, salt);
  const newEmployee = new Employees();
  newEmployee.name = req.body.nameCreate;
  newEmployee.password = hashemployee;
  newEmployee.role = req.body.role;
  newEmployee
    .save()
    .then(newEmployee => res.redirect("/boss"))
    .catch(err => console.log(err));
});

//////////Eliminar empleado.
router.post("/:id/delete", (req, res, next) => {
  Employees.findByIdAndRemove(req.params.id)
    .then(() => res.redirect("/boss"))
    .catch(error => next(error));
});

module.exports = router;
