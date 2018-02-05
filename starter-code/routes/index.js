const express = require("express");
const router = express.Router();
const isBoss = require("../middleWare/middleware.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/private/boss", isBoss, function(req, res, next) {
  res.render("private/boss");
});
router.post('/private/boss', function (req,res,next){
  
  let username = req.body.username
  let password = req.body.password
  let encryptedPass = bcrypt.hashSync(password, salt);
  res.send(username);
  // if (username == boss.username && encryptedPass == boss.password ){
  //     console.log("welcome boss, please create some new minions")
  // }else{
  //   console.log("you're not the boss, get the F out here")
  // }
})
module.exports=router;