const express = require("express");
const checkRole = require("../middlewares/checkRoles");
const router = express.Router();
const Employees = require("../models/Users");



router.get("/", (req, res, next) => {
  Employees.find()
    .then(employee => {
      console.log(employee)
      res.render("userBoss/userBoss", { employee });
    })
    .catch(err => {
      next(err);
    });
});

//////////Crear un nuevo empleado.

router.post("/", (req, res, next) => {
  const newEmployee = new Employees();
  newEmployee.name = req.body.nameCreate;
  newEmployee.password = req.body.passwordCreate;
  newEmployee.role = req.body.role;
  newEmployee.save()
    .then(newEmployee => res.redirect("/boss"))
    .catch(err => console.log(err));
});

//////////Eliminar empleado. 
router.post('/:id/delete', (req,res,next) => {
  Employees.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/boss'))
  .catch(error => next(error))
  
})

module.exports = router;
