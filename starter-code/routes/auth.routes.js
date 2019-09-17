const express = require("express");
const authRoutes = express.Router();
const authSecurity = require("./../middlewares/sec.mid");
const passport = require("passport");
const bcrypt = require("bcrypt");

const Users = require("./../models/Users.model");
const Courses = require("./../models/Courses.model");

// Render the add-employees screen
// User must be logged in to access
authRoutes.get(
  "/add-employees",
  authSecurity.hasRole("BOSS"),
  (req, res, next) => {
    const roles = ["BOSS", "DEVELOPER", "TA"];

    res.render("pages/private/add-employees", {
      roles: roles,
      user: req.user,
      isBoss: true
    });
  }
);

authRoutes.post("/add-employes", (req, res) => {
  console.log("Entraa");
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;

  if (!username || !password || !role) {
    res.redirect("/add-employees");
    return;
  }

  // Encrypt the password
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  Users.create({
    username,
    password: encryptedPassword,
    role
  }).then(userCreated => {
    res.redirect("/add-employees");
    return;
  });
});

// Render the login screen
// If the user is already logged, redirects to the index page
// If the user is not logged in, access to the login page
authRoutes.get("/login", authSecurity.userAlreadyLogged, (req, res, next) => {
  res.render("pages/login");
});

// When we login, we apply (in this case) the local-auth strategy.
// If OK, redirect to the index page
// If KO, redirect to the login page again
authRoutes.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

// Destroy the session when access to /logout
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Get other users profiles
authRoutes.get("/profiles", authSecurity.userLoggedIn, (req, res) => {
  Users.find().then(usersProfiles => {
    res.render("pages/private/profiles", { user: req.user, usersProfiles });
  });
});

// See user's profile
authRoutes.get("/profile", authSecurity.userLoggedIn, (req, res) => {
  res.render("pages/private/profile", { user: req.user });
});

authRoutes.get("/profile/edit", authSecurity.userLoggedIn, (req, res) => {
  res.render("pages/private/edit-profile", { user: req.user });
});

authRoutes.post("/profile/edit", (req, res) => {
  let newUsername = req.body.username;

  Users.findOne({ username: newUsername }).then(user => {
    if (user) {
      res.redirect("/profile");
      return;
    }

    Users.findOneAndUpdate(
      { username: req.user.username },
      { username: newUsername }
    ).then(userUpdated => {
      res.redirect("/profile");
    });
  });
});

// Routes for the courses
authRoutes.get("/courses", authSecurity.hasRole("TA"), (req, res) => {
  Courses.find().then(courses => {
    res.render("pages/private/courses", { user: req.user, courses });
  });
});

// Render a single curse
authRoutes.get("/courses/view/:id", authSecurity.hasRole("TA"), (req, res) => {
  Courses.findById(req.params.id).then(course => {
    res.render("pages/private/view-course", { user: req.user, course });
  });
});

// Render the new course screen
authRoutes.get("/courses/new", authSecurity.hasRole("TA"), (req, res) => {
  res.render("pages/private/new-course", { user: req.user });
});

// Add a new course
authRoutes.post("/courses/new", (req, res) => {
  let { name, code, nAlumnis, year, month } = req.body;

  // Check if the course already exists
  console.log("We are creating it...");
  Courses.findOne({ code })
    .then(course => {
      if (course) {
        res.redirect("/courses/new");
        return;
      }

      return Courses.create({
        code,
        name,
        nAlumnis,
        year,
        month
      });
    })
    .then(courseCreated => {
      res.redirect("/courses");
      return;
    });
});

// Render the screen to edit a course
authRoutes.get("/courses/edit/:id", authSecurity.hasRole("TA"), (req, res) => {
  Courses.findById(req.params.id).then(course => {
    res.render("pages/private/edit-course", { user: req.user, course });
  });
});

authRoutes.post("/courses/edit", (req, res) => {
  let { code, name, nAlumnis, year, month } = req.body;

  if (!code || !name || !nAlumnis || !year || !month) {
    res.redirect(`/courses/edit/${req.body._id}`);
    return;
  }

  Courses.findByIdAndUpdate(req.body._id, {
    code,
    name,
    nAlumnis,
    year,
    month
  }).then(courseUpdated => {
    res.redirect(`/courses/edit/${req.body._id}`);
  });
});

// Render the screen to delete a course
authRoutes.get(
  "/courses/delete/:id",
  authSecurity.hasRole("TA"),
  (req, res) => {
    Courses.findById(req.params.id).then(course => {
      res.render("pages/private/delete-course", { user: req.user, course });
    });
  }
);

// Delete a movie
authRoutes.post("/courses/delete", (req, res) => {
  Courses.findByIdAndDelete(req.body._id).then(courseDeleted => {
    res.redirect("/courses");
  });
});

// Login with Github
authRoutes.get("/auth/github", passport.authenticate("github"));

authRoutes.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = authRoutes;
