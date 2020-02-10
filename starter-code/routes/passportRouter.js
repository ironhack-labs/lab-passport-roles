const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const Users = require("../models/user");
const Courses = require("../models/course");
const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/users");
    }
  };
}

function checkAuthenticated() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/users");
    }
  };
}

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("/", { user: req.user });
  }
);

// passportRouter.get("/signup", (req, res) => {
//   res.render("passport/signup");
// });

passportRouter.get("/signupBoss", checkRoles("Boss"), (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === "" || password === "") {
    res.render("passport/login", {
      message: "Indicate username and password",
      section: "signup"
    });
    return;
  }

  User.findOne({
    username
  })
    .then(user => {
      if (user !== null) {
        res.render("passport/login", {
          message: "The username already exists",
          section: "signup"
          // user: user
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render("passport/login", {
            message: "Something went wrong",
            section: "signup"
          });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

passportRouter.get(
  "/login/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

passportRouter.post(
  "/login",

  passport.authenticate("local", {
    successReturnToOrRedirect: "/signupboss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.get("/logout", checkAuthenticated(), (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

passportRouter.get("/users", checkAuthenticated(), (req, res) => {
  Users.find().then(usersFound => res.render("users", { usersFound }));
});

passportRouter.get("/users/:id", (req, res) => {
  let { id } = req.params;
  Users.findById(id)
    .then(userFound => res.render("show", userFound))
    // .then(celebrityFound => res.json(celebrityFound))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.post(
  "/users/:id/delete",
  checkRoles("Boss"),
  (req, res, next) => {
    let { id } = req.params;
    Users.findByIdAndRemove(id).then(() => {
      res.redirect("/users").catch(err => {
        console.error("Error connecting to mongo");
        next(err);
      });
    });
    // }
  }
);

passportRouter.post("/users/:id/edit", (req, res, next) => {
  let { id } = req.params;
  Users.findById(id)
    .then(userFound => res.render("edituser", userFound))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.post("/users/:id", (req, res, next) => {
  let { id } = req.params;
  let user = {
    username: req.body.username
  };
  Users.findByIdAndUpdate(id, user)
    .then(() => Users.find())
    .then(usersFound => res.render("users", { usersFound }))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.get("/courses", (req, res) => {
  Courses.find().then(coursesFound =>
    res.render("courses/view", { coursesFound })
  );
});

passportRouter.get("/createcourse", checkRoles("TA"), (req, res) => {
  res.render("courses/create");
});

passportRouter.get("/editcourses", checkRoles("TA"), (req, res) => {
  Courses.find().then(coursesFound =>
    res.render("courses/edit", { coursesFound })
  );
});

passportRouter.post("/courses", checkRoles("TA"), (req, res) => {
  Courses.create({
    name: req.body.name,
    duration: req.body.duration
  }).then(() => {
    Courses.find()
      .then(coursesFound => res.render("courses/view", { coursesFound }))
      .catch(err => {
        console.error("Error connecting to mongo");
        next(err);
      });
  });
  // }
});

passportRouter.get("/courses/:id/edit", checkRoles("TA"), (req, res, next) => {
  let { id } = req.params;
  Courses.findById(id)
    .then(courseFound => res.render("courses/courseedit", courseFound))
    // .then(celebrityFound => res.json(celebrityFound))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.get("/courses/:id", (req, res, next) => {
  let { id } = req.params;
  Courses.findById(id)
    .then(courseFound => res.render("courses/courseedit", courseFound))
    // .then(celebrityFound => res.json(celebrityFound))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.post("/courses/:id", (req, res, next) => {
  let { id } = req.params;
  let course = {
    name: req.body.name,
    duration: req.body.duration
  };
  Courses.findByIdAndUpdate(id, course)
    .then(() => Courses.find())
    .then(coursesFound => res.render("courses/view", { coursesFound }))
    .catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
});

passportRouter.post("/courses/:id/delete", (req, res, next) => {
  let { id } = req.params;
  Courses.findByIdAndRemove(id).then(() => {
    res.redirect("/editcourses").catch(err => {
      console.error("Error connecting to mongo");
      next(err);
    });
  });

  // }
});

module.exports = passportRouter;
