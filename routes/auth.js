const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const checkRoles = require("../middlewares/checkRoles");
const checkBoss = checkRoles("Boss");
const bodyParser = require("body-parser");
const debug = require("../log")(__filename);
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: rol
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
authRoutes.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    res.render("auth/usersView", { user });
  } else {
    res.redirect("auth/login");
  }
});
authRoutes.post("/editProfile", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  password = bcrypt.hashSync(password, bcryptSalt);
  let updates = { username, password };
  debug(updates);
  User.findByIdAndUpdate(req.body.id, updates).then(() => {
    res.redirect("/auth/profile");
  });
});
authRoutes.get("/profiles", (req, res) => {
  User.find(
    { role: { $ne: "Boss" } },
    [],
    {
      sort: {
        role: -1
      }
    },
    (err, users) => {
      res.render("auth/profiles", { users });
    }
  );
});
authRoutes.get("/brightSide", checkBoss, (req,res) =>{
  res.render("auth/brightSide");
})
authRoutes.get("/management", checkBoss, (req, res) => {
  let user = req.user;
  res.render("auth/management", { user });
});
authRoutes.get("/addEmployee", checkBoss, (req, res) => {
  let user = req.user;
  res.render("auth/addEmployee", { user });
});
authRoutes.post("/addEmployee", checkBoss, (req, res) => {
  let user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcryptSalt),
    role: req.body.role
  };
  User.create(user).then(() => {
    debug("Recruited expendable apprentice: ", user);
  });
  res.redirect("/auth/management");
});
// authRoutes.get("/waitRecruited", checkBoss, (req,res)=>{
//   res.render("auth/waitRecruited");
//   setTimeout(()=>{res.redirect("/auth/management")}, 3000);
// })
authRoutes.get("/removeEmployee", checkBoss, (req, res) => {
  User.find(
    { role: { $ne: "Boss" } },
    [],
    {
      sort: {
        role: -1
      }
    },
    (err, users) => {
      res.render("auth/removeEmployee", { users });
    }
  );
});

authRoutes.get("/:id/removeEmployee", checkBoss, (req, res) => {
  User.findByIdAndRemove(req.params.id).then(() => {
    res.redirect("/auth/removeEmployee");
  });
});

module.exports = authRoutes;
