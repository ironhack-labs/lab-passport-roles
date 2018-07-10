const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { ensureLoggedIn, hasRole } = require("../middleware/ensureLogin");

router.get("/list", ensureLoggedIn("/auth/login"), (req, res, next) => {
  const currentUser = req.user;
  
  User.find({ _id: { $ne: currentUser._id } })
    .then(data => {
      res.render("employees/list", { employees: data });
    })
    .catch(err => {
      next();
    });
});

router.get(
  "/create",
  [ensureLoggedIn("/auth/login"), hasRole("Boss")],
  (req, res, next) => {
    res.render("employees/create");
  }
);

router.post(
  "/create",
  [ensureLoggedIn("/auth/login"), hasRole("Boss")],
  (req, res, next) => {
    const { username, password, role } = req.body;

    var fieldsPromise = new Promise((resolve, reject) => {
      if (username === "" || password === "" || role === "") {
        reject(
          new Error("Indicate a username, password and role to create the user")
        );
      } else {
        resolve();
      }
    });

    fieldsPromise
      .then(() => {
        return User.findOne({ username });
      })
      .then(user => {
        if (user) {
          throw new Error("The username already exists");
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
          username,
          password: hashPass,
          role
        });

        return newUser.save();
      })
      .then(user => {
        res.redirect("/employees/list");
      })
      .catch(err => {
        res.render("employees/create", {
          errorMessage: err.message
        });
      });
  }
);

router.post(
  "/:id/delete",
  [ensureLoggedIn("/auth/login"), hasRole("Boss")],
  (req, res, next) => {
    let employeeId = req.params.id;
    User.findByIdAndRemove(employeeId)
      .then(data => {
        console.log("Employee Deleted!");
        res.redirect("/employees/list");
      })
      .catch(err => next());
  }
);

module.exports = router;
