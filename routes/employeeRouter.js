const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const isBoss = require("../middleware/isBoss");

const isUser = require("../middleware/isUser");

router.get(
  "/add",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    res.render("add");
  }
);

router.post(
  "/add",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    console.log("llega");
    const { username, password, rol } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      rol: rol
    })
      .save()
      .then(user => {
        res.redirect("/boss");
      });
  }
);

router.get("/list", [ensureLoggedIn("/passport/login")], (req, res, next) => {
  User.find().then(users => {
    res.render("list", { users });
  });
});

router.get(
  "/update/:id",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id).then(user => {
      res.render("updateEmployee", user);
    });
  }
);

router.post(
  "/update/:id",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    const { name, password, rol } = req.body;
    const updates = { name, password, rol };
    User.findByIdAndUpdate(req.params.id, updates).then(user => {
      res.redirect("/employee/list");
    });
  }
);

router.get(
  "/remove/:id",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    User.findByIdAndRemove(req.params.id).then(user => {
      console.log(`SE HA BORRADO el usuario ${user.username}`);
      res.redirect("/employee/list");
    });
  }
);

router.get("/:id", [ensureLoggedIn("/passport/login")], (req, res, next) => {
  if (req.user.id === req.params.id) {
    console.log("SAME USER");
    User.findById(req.params.id).then(user => {
      res.render("updateMyProfile", user);
    });
  } else {
    console.log("DIFERENT USER");
    res.redirect("/");
  }
});


router.post("/updateMyProfile/:id", [ensureLoggedIn("/passport/login")], (req, res, next) => {
  if (req.user.id === req.params.id) {
    console.log("SAME USER");
    const { name, password, rol } = req.body;
    const updates = { name, password, rol };
    User.findByIdAndUpdate(req.params.id, updates).then(user => {
      res.redirect("/employee/list");
    });
  } else {
    console.log("DIFERENT USER");
    res.redirect("/");
  }
});


module.exports = router;
