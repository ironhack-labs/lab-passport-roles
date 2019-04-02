const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado");
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

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/private', isAuth, (req, res) => {
  let { user } = req;
  res.render('private', { user })
});

router.get("/boss", isAuth, checkRoles("BOSS"), (req, res) => {
  let { user } = req;
  Empleado.find()
    .then(empleados => {
      res.render("boss", { user, empleados });
    });
});

router.get("/main", isAuth, (req, res) => {
  let { user } = req;
  let canCreate; 
  Curso.find()
    .then(cursos => {
      cursos = cursos.map(curso => {
        return String(user.role) === String('TA')
          ? { ...curso._doc, canUpdate: true}
          : curso;
      });
      console.log('CURSOS', cursos);
      if (String(user.role) === String('TA')) {
        canCreate = true;
      } else {
        canCreate = false;
      }
      res.render("main", { user, cursos, canCreate });
    });
});

module.exports = router;