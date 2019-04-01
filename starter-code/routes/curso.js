const express = require("express");
const router = express.Router();
const Curso = require("../models/Curso");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/main");
    }
  };
}

router.get("/new", isAuth, checkRoles("TA"), (req, res) => {
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