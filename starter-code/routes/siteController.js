const express = require("express");
const siteController = express.Router();
var path = require('path');
var debug = require('debug')('passport-demo:'+path.basename(__filename));



siteController.get("/", (req, res, next) => {
  if(req.user){
    debug(req.user);
  }else{
    debug("User is not logged in");
  }
  res.render('index', { title: 'Express', user:req.user });
});


// const checkRoles = (role) => {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       debug("ok, you have access to the platform");
//       return next();
//     } else {
//       debug("Warning, non Role permited trying to access");
//       res.redirect('/auth/login');
//     }
//   };
// };
//
// router.get('/room/:id_room', checkRoles('ROOMOWNER'), (req, res, next) => {
//   const {id_room} = req.params;
//   Room.findById(id_room).populate('owner').exec().then(r => {
//     console.log(r);
//     return res.render('room', {
//       title: `Room ${r.title}`,
//       room:r
//     });
//   });
// });


module.exports = siteController;
