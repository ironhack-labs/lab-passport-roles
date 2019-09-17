const express = require("express");
const autRouter = express.Router();
const User = require("../models/User");
const Courses = require("../models/Courses");
const bcrypt = require("bcrypt");
const passport = require("passport");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const secure = require("../middlewares/secure.mid");

/* GET home page */
autRouter.get("/login", (req, res, next) => {
  res.render("auth/login");
});

autRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/auth/index-users",
    failureRedirect: "/auth/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

autRouter.get(
  "/index-users",
  [ensureLogin.ensureLoggedIn(), secure.initialRole()],
  (req, res, next) => {
    res.render("auth/index-users.hbs");
  }
);

autRouter.get(
  "/profiles-users",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    if (req.query.error) {
      User.find()
        .select({ username: 1 })
        .then(allUsers => {
          res.render("auth/profiles-users", {
            allUsers,
            error: "Something went wrong, please, try again"
          });
        })
        .catch(error => {
          res.json({ error: "Error while getting the users from the DB" });
        });
    } else {
      User.find()
        .select({ username: 1 })
        .then(allUsers => {
          res.render("auth/profiles-users", { allUsers });
        })
        .catch(error => {
          res.json({ error: "Error while getting the users from the DB" });
        });
    }
  }
);

autRouter.get(
  "/profile-details/:id",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        console.log(user);
        res.render("auth/profile-details", { user });
      })
      .catch(error => {
        res.json({ error: "This celebrity was not found" });
      });
  }
);

autRouter.get(
  "/index-boss",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("BOSS")],
  (req, res) => {
    res.render("auth/index-boss");
  }
);

autRouter.get(
  "/signup",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("BOSS")],
  (req, res) => {
    res.render("auth/signup");
  }
);

autRouter.post("/signup", (req, res, next) => {
  const { username, password, role } = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Please, introduce both username and password"
    });
  }
  User.findOne({ username })
    .then(user => {
      if (user === null) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
          username,
          password: hashPass,
          role
        });
        newUser.save(err => {
          if (err) {
            res.render("auth/signup", { message: "Something went wrong" });
          } else {
            res.redirect("/");
            return;
          }
        });
      } else {
        res.render("auth/signup", { message: "The user already exists" });
      }
    })
    .catch(error => {
      next(error);
    });
});

autRouter.get(
  "/profiles-boss",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("BOSS")],
  (req, res, next) => {
    if (req.query.error) {
      User.find()
        .select({ username: 1 })
        .then(allUsers => {
          res.render("auth/profiles-boss", {
            allUsers,
            error: "Something went wrong, please, try again"
          });
        })
        .catch(error => {
          res.json({ error: "Error while getting the users from the DB" });
        });
    } else {
      User.find()
        .select({ username: 1 })
        .then(allUsers => {
          res.render("auth/profiles-boss", { allUsers });
        })
        .catch(error => {
          res.json({ error: "Error while getting the users from the DB" });
        });
    }
  }
);

autRouter.post(
  "/profiles/delete",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("BOSS")],
  (req, res) => {
    User.findByIdAndDelete(req.body.id)
      .then(deletedUser => {
        res.redirect("/auth/profiles-boss");
      })
      .catch(error => {
        res.redirect("/auth/profiles-boss?error=please-try-again");
      });
  }
);

autRouter.get(
  "/index-TA",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("TA")],
  (req, res) => {
    res.render("auth/index-TA");
  }
);

autRouter.get(
  "/create-course",
  [ensureLogin.ensureLoggedIn(), secure.checkRole("TA")],
  (req, res) => {
    res.render("auth/create-course");
  }
);

autRouter.post("/create-course", (req, res, next) => {
  const { course, startDate, endDate } = req.body;
  if (course === "" || startDate === "" || endDate === "") {
    res.render("auth/create-course", {
      message: "Please, introduce all the fields"
    });
  }
  Courses.findOne({ course })
    .then(course => {
      if (course === null) {
        const newCourse = new Courses({
          course,
          startDate,
          endDate
        });
        newCourse.save(err => {
          if (err) {
            res.render("auth/create-course", { message: "Something went wrong" });
          } else {
            res.redirect("/auth/index-TA");
            return;
          }
        });
      } else {
        res.render("auth/create-course", { message: "The course already exists" });
      }
    })
    .catch(error => {
      next(error);
    });
});

autRouter.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = autRouter;
