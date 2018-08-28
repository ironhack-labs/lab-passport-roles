const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User");

router.use(ensureLogin.ensureLoggedIn("/auth/login"));

router.get("/create", (req, res, next) => {
  res.render("user/create", { error: req.flash("error") });
});

router.post("/create", (req, res, next) => {
  const { username, password, role } = req.body;

  const encrypted = bcrypt.hashSync(password, 10);

  new User({ username, password: encrypted, role })
    .save()
    .then(result => {
      res.redirect("/user/list");
    })
    .catch(err => {
      if (err.code === 11000) {
        return res.render("user/create", { error: "user exists already" });
      }
      console.error(err);
      res.send("something went wrong");
    });
});

router.get("/profile", (req, res, next) => {
  const user = req.user;

  res.render("user/profile", user);
});

router.post("/profile", (req, res, next) => {
  const userCurrent = req.user.username;
  const userUpdate = req.body.username;
  User.findOneAndUpdate(
    { username: userCurrent },
    { username: userUpdate },
    { new: true }
  ).then(user => {
    console.log("new name", user);
    res.render("user/profile", user);
  });
});

router.get("/profile/edit", (req, res, next) => {
  const user = req.user;

  res.render("user/edit", user);
});

router.get("/list", (req, res, next) => {
  User.find({}).then(employees => {
    res.render("user/list", { employees });
  });
});

router.get("/:id/delete", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/user/list");
    })
    .catch(console.error);
});

module.exports = router;
