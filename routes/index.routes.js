const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res) => res.render("index"));
const checkRole = (role) => (req, res, next) =>
  req.isAuthenticated() && req.user.role.includes(role)
    ? next()
    : res.render("auth/login", {
        errorMsg: "Área restringida",
      });

router.get("/bosszone", checkRole("BOSS"), (req, res) =>
  res.render("bosszone")
);

const checkBoss = (role) => (role === "BOSS" ? true : null);
router.get("/employees", (req, res) => {
  console.log(req.user.role);
  if (checkBoss(req.user.role)) {
    console.log("----------ERES EL BOSS");
    User.find()
      .then((allEmployees) =>
        res.render("employees", { allEmployees, role: req.user.role })
      )
      .catch((err) => console.log(`An error ocurred ${err}`));
  } else {
    console.log("------------NO ERES EL BOSS");
    User.find()
      .then((allEmployees) => res.render("employees", { allEmployees }))
      .catch((err) => console.log(`An error ocurred ${err}`));
  }
});

module.exports = router;
