const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();

const User = require("../models/User");

router.get('/', (req, res, next) => {

  User.findById(req.user.id)
  .then( user => {
    res.render('user/index',{user});
  })
});

router.get("/show", (req, res, next) => {
  User.find()
  .then( users_details => {
    res.render("user/show", {users_details});
  })
});

router.get("/:id/edit", (req, res, next) => {

  User.findById(req.params.id)
  .then(user_detail => {
    res.render("user/edit", {user_detail});
  })
  .catch(err => res.render("error", err));

});

router.post("/:id/edit", (req, res, next) => {

  const { username, role } = req.body;
  const userEdit = {username, role};

  User.findByIdAndUpdate(req.params.id, userEdit)
    .then(res.redirect("/user-page/"))
    .catch(err => res.render("error", err));
});
  

module.exports = router;