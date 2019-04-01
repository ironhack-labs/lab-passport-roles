const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado");

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
  console.log("logged", req.user);
  res.render("index");
});

router.get('/main', (req, res) => {
  res.render('main')
})

router.get("/private", isAuth, checkRoles("BOSS"), (req, res) => {
  let { user } = req;
  Empleado.find()
    .then(empleados => {
      res.render("private", { user, empleados });
    });
});

/*router.get("/admin", checkRoles("BOSS"), (req, res) => {
  let { user } = req;
  Empleado.find().then(empleados => {
    res.render("admin", { empleados, user });
  });
});*/

module.exports = router;