const express = require("express");
const router = express.Router();

const checkRole = role => (req, res, next) =>
  req.user && req.user.role === role
    ? next()
    : res.render("index", {
        roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
      });
const isRole = role => (req, res, next) => req.user && req.user.role === role;

router.get("/ta-page", checkRole("TA"), (req, res) =>
  res.render("save-items", { user: req.user })
);
router.get("/developer-page", checkRole("DEVELOPER"), (req, res) =>
  res.render("edit-items", { user: req.user })
);
router.get("/boss-page", checkRole("BOSS"), (req, res) =>
  res.render("administrate-items", { user: req.user })
);
router.get("/miscelania-page", (req, res) =>
  res.render("conditional-rendering", { isAdmin: isRole("BOSS") })
);

module.exports = router;
