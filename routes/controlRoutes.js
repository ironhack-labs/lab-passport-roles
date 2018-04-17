const express = require('express');
const User = require("../models/User");
const router = express.Router();
// const ensureLoggedOut = require('../middlewares/ensureLoggedOut');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const isBoss = require('../middlewares/isBoss');
const bcrypt = require('bcrypt');
const passport = require('passport');

const bcryptSalt = 10;



// router.get('/', (req, res, next) => { //  / = /auth
//   res.render('control/login');
// });

/* GET register page */

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/control/employeeManagement",
        failureRedirect: "/control/login",
        failureFlash: false,
        passReqToCallback: false
    })
);

router.get("/login", /*ensureLoggedOut("/"),*/ (req, res, next) => {
    res.render("control/login");
});

router.get('/employeeManagement', isBoss('homeEmployees'), (req, res) => {
    User.find((err, users) => {
      if (err) return next(err);
      res.render("control/employeeManagement", { users });
    });
  });

  //  Routing to the form page

  
  //  Routing the form data to the user route
  router.post("/employeeManagement/new", (req, res, next) => {
    //destructuring req.body into an object
    const { username, password, roles } = req.body;  
    const user = new User({ username, password, roles});
    
    user
      .save()
      .then(user => {
        console.log(`${username} added to the database.`);
        res.redirect("control/employeeManagement");
      })
      // if values missing
      .catch(() => {
        res.render("control/employeeManagement");
      });
  });

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//         next();
//     } else {
//         res.redirect("login");
//     }
// });

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});



module.exports = router;