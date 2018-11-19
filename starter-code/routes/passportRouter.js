const express        = require("express");
const passportRouter = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const passport       = require("passport");
const ensureLogin    = require("connect-ensure-login");
const mongoose = require("mongoose");

const bcryptSalt = 10;

function checkRoles(rol) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.rol === rol) {
      return next();
    } else {
      console.log(rol, req)
      res.redirect('/privateall')
    }
  }
}

const checkBoss  = checkRoles('Boss');
const checkTA = checkRoles('TA');
const checkDeveloper  = checkRoles('Developer');

passportRouter.get("/privateall", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/privateall", { user: req.user });
});

passportRouter.get("/privateboss",ensureLogin.ensureLoggedIn(),checkBoss, (req, res) => {
  User.find({})
  .then((data) => {
    res.render("passport/privateboss", { data:data, user:req.user });
  })
});
passportRouter.get("/delete/:id", (req, res, next) => {
  User.deleteOne({_id:req.params.id}).then(()=>{
    res.redirect('/privateall');
  })
})

passportRouter.post("/change/:name", (req, res, next) => {
  const name = req.body.newusername;
  User.findOneAndUpdate({username:req.params.name},{username:name}).then((data) => {
    res.redirect('/privateall');
  })
})


passportRouter.get("/privateta", ensureLogin.ensureLoggedIn(),checkTA, (req, res) => {
  User.find({})
  .then(data => { 
    res.render("passport/privateta", { data:data , user:req.user});
  })
});

// passportRouter.get("/signup", (req, res, next) => {
//   res.render('passport/signup');
// })

// passportRouter.post("/signup", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const rol = req.body.rol;

//   if (username === "" || password === "") {
//     res.render("passport/signup", { message: "Indicate username and password" });
//     return;
//   }

//   User.findOne({ username })
//   .then(user => {
//     if (user !== null) {
//       res.render("passport/signup", { message: "The username already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username,
//       password: hashPass,
//       rol
//     });

//     newUser.save((err) => {
//       if (err) {
//         res.render("passport/signup", { message: "Something went wrong" });
//       } else {
//         res.redirect("/");
//         console.log("createddddddddd")
//       }
//     });
//   })
//   .catch(error => {
//     next(error)
//   })
// });

passportRouter.post("/create", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.rol;

  if (username === "" || password === "") {
    res.render("passport/privateboss", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/privateboss", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      rol
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/privateboss", { message: "Something went wrong" });
      } else {
        res.redirect("/privateall");
        console.log("createddddddddd")
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

passportRouter.get("/login", (req, res, next) => {
  res.render('passport/login');
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/privateall",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = passportRouter;