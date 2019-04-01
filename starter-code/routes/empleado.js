const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado");

router.get("/new", (req, res) => {
  res.render("empleado-form");
});

router.post("/new", (req, res) => {
  Empleado.create(req.body)
    .then(() => {
      res.redirect("/private");
    });
});

module.exports = router;