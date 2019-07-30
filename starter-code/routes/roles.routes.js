const express = require("express");
const router = express.Router();

const checkRoles = role => (req, res, next) => (req.user && req.user.role === role ? next() : res.render("index", { msg: `You need to be a ${role} to access this area` }));

router.get("/roles/boss", checkRoles("BOSS"), (req, res, next) => res.render("roles/boss"));

router.get("/roles/developer", checkRoles("DEVELOPER"), (req, res, next) => res.render("roles/developer"));

router.get("/roles/ta", checkRoles("TA"), (req, res, next) => res.render("roles/ta"));

module.exports = router;
