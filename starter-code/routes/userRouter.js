const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/User")

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
// Add passport 
const passport = require("passport")



function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkIfSelforBoss() {
  return function(req, res, next) {
    if (""+req.params.id==""+req.user._id||req.user.role=="BOSS") {
      return next()
    } else {
      res.redirect('/login')
    }
  }
}

function checkAuth() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkTA  = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');
const checkBoss  = checkRoles('BOSS');

passportRouter.get("/users", checkAuth(), (req, res) => {
  if(req.user.role==="STUDENT"){
    User.find({"role": "STUDENT"})
    .then(users => res.render("passport/users", {users}))
    .catch(err    => next(err))
  } else {
    User.find()
    .then(users => res.render("passport/users", {users}))
    .catch(err    => next(err))
  }
})

passportRouter.post("/users/delete/:id", checkBoss, (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(()  => {
    res.redirect('/users') 
  })
  .catch(err    => next(err))
})


passportRouter.get("/users/details/:id", checkAuth(),(req, res) => {
  User.findById(req.params.id)
  .then(user   => {
    const data = [user,undefined]
    if(""+user._id==""+req.user._id||req.user.role=="BOSS") data[1] = true
    res.render("passport/userdetail", {data}) 
  })
  .catch(err    => next(err))
})

passportRouter.get("/users/details/:id/edit", checkIfSelforBoss(),(req, res) => {
  User.findById(req.params.id)
  .then(user   => {
    res.render("passport/useredit", {user}) 
  })
  .catch(err    => next(err))
})

passportRouter.post("/users/details/:id", checkIfSelforBoss(),(req, res) => {
  const {username, newpassword, role} = req.body
  const salt   = bcrypt.genSaltSync(bcryptSalt)
  const password = bcrypt.hashSync(newpassword, salt)

  User.updateOne({_id: req.params.id}, { $set: {username, password, role}})
  .then((user)    => {
    checkIfSelforBoss(user)
    res.redirect('/users')
  })
  .catch(err  => next(err))
})


passportRouter.get("/signup", checkBoss, (req, res) => res.render("passport/signup"))

passportRouter.post("/signup", checkBoss, (req, res, next) => {
  const {username ,password,role} = req.body

  User.findOne({ "username": username })
      .then(user => {
          if (user !== null) {
              res.render("auth/signup", {
                  errorMsg: "The username already exists!"
              })
          return
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPass, role})
          .then(()        => res.redirect("/"))
          .catch(error    => console.log(error))
  })
})

passportRouter.get("/login", (req, res) => res.render("passport/login",{ "message": req.flash("error") }))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = passportRouter;