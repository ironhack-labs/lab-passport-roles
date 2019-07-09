const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Require user model



const session = require("express-session");
const bcrypt = require("bcrypt"); // Add bcrypt to encrypt passwords
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


// Add passport 
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
}));

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }

            User.create({
                username,
                password: hashPass,
                role
            })
                .then(() => {
                    res.redirect("/login");
                })
                .catch(error => {
                    console.log(error);
                })
        });
});

const ensureLogin = require("connect-ensure-login");

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});
function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/private')
        }
    }
}
function checkAny() {
    return function (req, res, next) {
        if (!req.user) {
            res.redirect('/login')
        } else {

            return next();
        }
    }
}
const checkBoss = checkRoles('boss');
const checkDeveloper = checkRoles('developer');
const checkTa = checkRoles('ta');


router.get("/signup", checkBoss, (req, res, next) => {
    res.render("auth/signup", { user: req.user });
});

router.get('/private', checkAny(), (req, res) => {
    User.find()
        .then(usersList => {
            usersList.forEach(item => {
                if (req.user._id.equals(item._id) || req.user.role === 'boss') {
                    item.canEdit = true;
                }
            });
            res.render('private', { usersList });
        })
        .catch(err => console.log(err));
});


  // go to edit page
  router.get('/user/:id/edit', checkAny(), (req, res) => {
    console.log(req.params);
    User.findById(req.params.id)
        .then(item => { 
            console.log(item);


            res.render('auth/edit', item);
        })
        .catch(err => console.log(err));
  });



  // recieve edit info and update
  router.post('/user/:id/edit', (req, res, next) => {
    const { id, username, password } = req.body;
    console.log({ id});
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.updateOne({_id: id}, { $set: { username, password: hashPass }})
    .then(() => {
      console.log(id);
      res.redirect('/private');
    })
    .catch((error) => {
      console.log(error);
    })
  });

//   // delete 
//   router.post('/movie/delete', (req, res) => {
//     const {id} = req.body;

//     Movie.findByIdAndRemove(id)
//         .then(movie => {

//             res.redirect('/movies');
//         })
//         .catch(err => console.log(err));
//   });



module.exports = router;