const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.user) {
    if (req.user.role == "Boss") {
      return res.render("index", { boss: req.user.username, user: req.user });
    } 
    if(req.user.role == "TA"){
      return res.render("index", { TA: req.user.username, user: req.user})
    }
    res.render("index", { user: req.user });
  } else {
    res.render("index");
  }
});

module.exports = router;
