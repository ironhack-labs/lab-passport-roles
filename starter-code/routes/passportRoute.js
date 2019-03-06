const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10; 
const passport = require("passport")
const ensureLogin = require("connect-ensure-login")



passportRouter.get('/private', checkRoles('BOSS'), (req, res) => {
  res.render('private', {user: req.user});
});

passportRouter.get('/private', checkRoles('TA'), (req, res) => {
  res.render('private', {user: req.user});
});

//MIDDLEWARE
function checkRoles(boss) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === boss) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}
//ruta que hace q me muestre la lista de los empleados
passportRouter.get("/list",checkRoles('BOSS'),(req,res) =>{
  User.find()
  .then(list => {
    res.render("passport/list",{list})
  })
  .catch(err => console.log("MAL"))
})

passportRouter.get("/courses",checkRoles('TA'),(req,res) =>{
  User.find()
  .then(list => {
    res.render("passport/courses",{list})
  })
  .catch(err => console.log("MAL"))
})

passportRouter.get("/delete/:id",checkRoles('BOSS'),(req,res) =>{
  User.findByIdAndDelete(req.params.id)
  .then(list => {
    res.redirect("/list") //el render no tiene en cuanta las actualizaciones por eso ponemos redirect. asi nos ,uestra la lista actualizada.
  })
  .catch(err => console.log("MAL"))
})

passportRouter.get("/delete/:id",checkRoles('TA'),(req,res) =>{
  User.findByIdAndDelete(req.params.id)
  .then(list => {
    res.redirect("/courses") //el render no tiene en cuanta las actualizaciones por eso ponemos redirect. asi nos ,uestra la lista actualizada.
  })
  .catch(err => console.log("MAL"))
})


passportRouter.get("/signup", checkRoles('BOSS'), (req, res, next) => {//ruta (signup)
  res.render("passport/signup"); //vista passport/signup
});

passportRouter.get("/signup", checkRoles('TA'), (req, res, next) => {//ruta (signup)
  res.render("passport/signup"); //vista passport/signup
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username; //el name que ponemos en el input del signup.hbs debe ser igual en req.body.......
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });
    

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
    /*
    newUser.save()
    .then(() => res.redirect("/");)
    .catch(err => res.render("passport/signup", { message: "Something went wrong" }))
    */
  })
  .catch(error => {
    next(error)
  })
});





// const ensureLogin = require("connect-ensure-login");

// Add passport 
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": "error" });
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}))



module.exports = passportRouter;