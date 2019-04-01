const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado");

router.get("/new", (req, res) => {
  res.render("empleado-form");
});

router.post("/new", (req, res) => {
  Empleado.create(req.body)
    .then(() => {
      res.redirect("/boss");
    });
});

router.get('/:id/edit', (req, res) => {
  let { id } = req.params;
  Empleado.findById(id)
  .then(empleado => {
    res.render('empleado-form', empleado);
  });
});

router.post('/:id/edit', (req, res) => {
  let { id } = req.params;
  Empleado.findByIdAndUpdate(id, {$set: {...req.body}})
  .then(empleado => {
    res.redirect('/boss');
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/:id/delete', (req, res) => {
  let { id } = req.params;
  Empleado.findByIdAndDelete(id)
  .then(() => {
    res.redirect('/boss');
  });
});

module.exports = router;