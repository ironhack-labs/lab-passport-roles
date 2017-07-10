const express = require("express");
const siteController = express.Router();
//const ensureLogin = require("connnect-ensure-login");

// siteController.use((req,res)=>{
//   if (req.user && req.user.role === "Boss") {
//     next();
//
//   }else if(!req.user){
//     res.status(403).send("User is no logged user!");
//
//   }else {
//     res.status(403).send("you are not persmissions here!!");
//   }
// });

siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;
