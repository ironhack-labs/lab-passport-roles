const express = require("express");
const empRouter = express.Router();
const passportRouter = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role.includes(role)) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

//GET CREATE
empRouter.get(
  "/new",
  [ensureLogin.ensureLoggedIn(), checkBoss],
  (req, res, next) => {
    res.render("new");
  }
);

//POST CREATE
empRouter.post(
  "/new",
  [ensureLogin.ensureLoggedIn(), checkBoss],
  (req, res, next) => {
    const { username, password, role } = req.body;
    User.create({ username: username, password: password, role: role })
      .then(user => {
        console.log("User created:", user);
        res.redirect("/employees");
      })
      .catch(e => console.log(e));
  }
);

//POST DELETE
empRouter.post(
  "/:id/delete",
  [ensureLogin.ensureLoggedIn(), checkBoss],
  (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
      .then(deleted => {
        console.log("user Deleted", deleted);
        res.redirect("/employees");
      })
      .catch(next);
  }
);

empRouter.get("/list", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find().then(users => {
    res.render("list", { user: req.user, users });
  });
});
empRouter.get(
  "/:id/profile",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    User.findById(req.params.id).then(user => {
      res.render("profile", { user });
    });
  }
);

function isMe(id) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user._id == id) {
      return next();
    } else {
      res.redirect("/list");
    }
  };
}

//GET UPDATE
empRouter.get("/:id/edit", (req, res, next) => {
   
  if (req.user._id == req.params.id) {
    User.findById(req.params.id)

      .then(user => {
        res.render("edit", { user });
      })
      .catch(next);
  } else {
      res.redirect("/list");
  }
});

//POST UPDATE
empRouter.post("/:id/edit", (req, res, next) => {
  const { username, password } = req.body;
  console.log("!!!", req.body);
  User.findByIdAndUpdate(req.params.id, {
    username: username,
    password: password
  })
    .then(updated => {
      let stringId = encodeURIComponent(updated._id);
      res.redirect("/list");
    })
    .catch(next);
});

module.exports = empRouter;
