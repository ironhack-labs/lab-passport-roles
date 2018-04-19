const express = require("express");

const User = require("../models/user-model");

const router = express.Router();

router.get("/boss/users", (req, res, next) => {
  if (!req.user || req.user.role !== "Boss") {
    next();
    return;
  }

  User.find()
    .then(userFromDb => {
      res.locals.userList = userFromDb;
      res.render("boss-views/user-list-page");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/boss/users/add", (req, res, next) => {
  res.render("boss-views/user-form");
});

router.post("/process-user", (req, res, next) => {
  //res.send(req.body);
  const { fullName, email, role, encryptedPassword } = req.body;
  User.create({ fullName, email, role, encryptedPassword })
    .then(() => {
      res.redirect("boss/users");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/boss/users/:userId/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .then(() => {
      res.redirect("/boss/users");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
