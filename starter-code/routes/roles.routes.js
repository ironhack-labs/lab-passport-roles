const express = require("express");
const router = express.Router();
const User = require("../models/User.model");


const checkRole = role => (req, res, next) =>
  req.user && req.user.role === role
    ? next()
    : res.render("index", {
        roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
    });
      
const isRole = role => (req, res, next) => req.user && req.user.role === role; //// ????

router.get("/ta-page", checkRole("TA"), (req, res) =>
  res.render("ta", { user: req.user })
);

router.get("/developer-page", checkRole("DEVELOPER"), (req, res) =>
  res.redirect("develop", { user: req.user })
);

router.get("/boss-page", checkRole("BOSS"), (req, res) =>
  res.render("boss", { user: req.user })
);




module.exports = router;


