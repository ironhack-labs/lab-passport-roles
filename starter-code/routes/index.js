var express = require('express');
var path = require('path');
var debug = require('debug')('passport-demo:'+path.basename(__filename));
let Room = require('../models/Room');
var router = express.Router();
const ensureLogin = require("connect-ensure-login");

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    debug(req.user);
  }else{
    debug("User is not logged in");
  }
  res.render('index', { title: 'Express', user:req.user });
});


router.get('/private',ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('private', { title: 'pagina privada'});
});


router.get('/room', (req, res, next) => {
  const {id_room} = req.params;
  Room.find({}).populate('owner').exec().then(rooms => {
    console.log(rooms);
    return res.render('rooms', {
      title: `Rooms`,
      rooms: rooms
    });
  }).catch(e => console.log(e));
});


const checkRoles = (role) => {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      debug("ok, you have access to the room");
      return next();
    } else {
      debug("Warning, non ROOMOWNER trying to access");
      res.redirect('/auth/login');
    }
  };
};

router.get('/room/:id_room', checkRoles('ROOMOWNER'), (req, res, next) => {
  const {id_room} = req.params;
  Room.findById(id_room).populate('owner').exec().then(r => {
    console.log(r);
    return res.render('room', {
      title: `Room ${r.title}`,
      room:r
    });
  });
});


module.exports = router;
