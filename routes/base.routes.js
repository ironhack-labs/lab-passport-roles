const express = require('express')
const router = express.Router()

const checkLoggedIn = (req, res, next) =>
  req.isAuthenticated()
    ? next()
    : res.render("login", {
        message: "Desautorizado, incia sesión para continuar",
      });

const checkRole = (rolesToCheck) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
      next();
    } else {
      res.render("login", {
        message: "Desautorizado, no tienes permisos para ver eso.",
      });
    }
  };
};

// Endpoints

router.get("/", (req, res) => res.render("index"));


router.get(
  "/delete-documentation",
  checkRole(["boss", "ta"]),
  (req, res, next) =>
    res.render("documentation", {
      user: req.user,
      isBoss: req.user.role === "boss",
    })
);


module.exports = router;
