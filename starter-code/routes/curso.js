const express = require("express");
const router = express.Router();
const Curso = require("../models/Curso");

router.get("/new", (req, res) => {
  res.render("curso-form");
});

router.post("/new", (req, res) => {
  Curso.create(req.body)
    .then(() => {
      res.redirect("/main");
    });
});

router.get('/:id/edit', (req, res) => {
  let { id } = req.params;
  Curso.findById(id)
  .then(curso => {
    res.render('curso-form', curso);
  });
});

router.post('/:id/edit', (req, res) => {
  let { id } = req.params;
  Curso.findByIdAndUpdate(id, {$set: {...req.body}})
  .then(curso => {
    res.redirect('/main');
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/:id/delete', (req, res) => {
  let { id } = req.params;
  Curso.findByIdAndDelete(id)
  .then(() => {
    res.redirect('/main');
  });
});

module.exports = router;