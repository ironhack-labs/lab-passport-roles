const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/", (req, res, next) => {
  res.render("index")
});

router.get("/signup", (req, res, next) => {
  res.render("signup")
});

router.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});



router.get('/list',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then(user => {
    res.render('list',{user});
  })
  .catch(err => {
    next(err)
  })
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render("signup", {
            message: "Something went wrong"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

router.post("/login", passport.authenticate("local", {
 
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}), ()=> { usernm = req.user});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.post('/list/:id/delete', checkRoles("BOSS"), (req, res, next) => {
  let userId = req.params.id 
  console.log(userId);
  
  User.findByIdAndRemove(userId)
  .then(users => {
    res.redirect("/list");
    
  })
  .catch(err => {
    next(err)
  })
});

router.get('/edit/:id', (req, res, next) => {
  let userId = req.params.id;
  console.log(checkEdit(userId)(req))
  if(checkEdit(userId)(req,res)==true){
  User.findById(userId)
  .then(user => {
    res.render('edit',{user});
  }).catch(err => {
    next(err)
  })}else {res.render("list",{
    errorMessage: "You dont have permission to do that"
  })}
  
});

router.post('/edit/:id', (req, res, next) => {
  let userId = req.params.id;
  const{username,role} = req.body
  User.findByIdAndUpdate(userId, {username,role})
  .then(user => {
    res.redirect("/list");
    
  })
  .catch(err => {
    next(err)
  })
});

function checkRoles() {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "BOSS") {
      console.log("jefe")
      return true;
    } else {
      
       return false
    }
  }
}
function checkEdit(id) {
  return function(req, res, next) {
    if ((req.user.id === id)|| (checkRoles()(req) == true)){
      console.log("jefe")
      console.log(res)
      return true;
    } else {
      
      return false
    }
  }
}


module.exports = router;