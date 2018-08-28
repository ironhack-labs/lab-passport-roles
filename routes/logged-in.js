const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/profile", (req, res, next) => {
  const user = req.user;

  res.render("logged-in/profile", user);
});

router.post("/profile", (req, res, next) => {
  const userCurrent = req.user.username;
  const userUpdate = req.body.username;
  User.findOneAndUpdate(
    { username: userCurrent },
    { username: userUpdate },
    () => {
      const user = req.user;

      res.render("logged-in/profile", user);
    }
  );
});

router.get("/profile/edit", (req, res, next) => {
  const user = req.user;

  res.render("logged-in/edit", user);
});

module.exports = router;
