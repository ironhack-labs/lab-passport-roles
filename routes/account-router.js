const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/user-model");

router.get("/account-details", (req, res, next) => {
  console.log(req.user);
  res.render("user-view/account");
});

router.get("/login", (req, res, next) => {
  res.render("user-view/login");
});

router.post("/process-login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(userDetails => {
      if (!userDetails) {
        res.redirect("/login");
        return;
      }
      const { encryptedPassword } = userDetails;
      if (!bcrypt.compareSync(password, encryptedPassword)) {
        res.redirect("/login");
        return;
      }
      req.login(userDetails, () => {
        res.redirect("/");
      });
    })
    .catch(err => {
      next(err);
    });
    console.log("success login");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
  console.log("success logout");
});


router.get('/register-new', (req, res, next)=>{
    // console.log(req.user);
    if(!req.user || req.user.role !== "Boss"){
        res.redirect("/");
        return;
    }
    res.render('admin-view/register-form');
});

router.post('/registration-process', (req, res, next)=>{
    if(!req.user || req.user.role !== "Boss"){
        res.redirect("/");
        return;
    }
    const { name, username, role, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    encryptedPassword = bcrypt.hashSync( password, salt );

    User.create({ name, username, role, encryptedPassword})
    .then(()=>{
        res.redirect('/employees-list');
    })
    .catch((err)=>{
        next(err);
    });
});

router.get('/employees-list', (req, res, next)=>{
    if(!req.user ){
        res.redirect("/");
        return;
    }
    User.find()
    .then((allUsers)=>{
        res.locals.userList = allUsers;
        res.render('admin-view/all-employees');
    })
    .catch((err)=>{
        next(err);
    })
});

router.post("/delete/:employeeId/employee", (req, res, next)=>{
    if(!req.user || req.user.role !== "Boss"){
        res.redirect("/");
        return;
    }

    User.findByIdAndRemove(req.params.employeeId)
    .then(()=>{
        res.redirect('/employees-list');
    })
    .catch((err)=>{
        next(err);
    })
});

router.get("/change-your-account-information", (req, res, next)=>{
    if(!req.user){
        res.redirect("/");
        return;
    }
    res.render('user-view/change-info');
});

router.post("/process-edit-account", (req, res, next) => {
  const { name, username, password } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    encryptedPassword = bcrypt.hashSync(password, salt);

    User.findByIdAndUpdate(
      req.user._id,
      { name, username, encryptedPassword },
      { runValidators: true }
    )
      .then(() => {
        res.redirect("/account-details");
      })
      .catch(err => {
        next(err);
      });
  } else{
    User.findByIdAndUpdate(
        req.user._id,
        { name, username },
        { runValidators: true }
      )
        .then(() => {
          res.redirect("/account-details");
        })
        .catch(err => {
          next(err);
        });
  }
});

module.exports = router;



