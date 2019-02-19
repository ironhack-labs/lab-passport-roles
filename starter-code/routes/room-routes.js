const express        = require('express');
const router         = express.Router();
// Require user model
const User           = require('../models/user');
const Room           = require('../models/room')
const multer         = require('multer') 
//Add cloud storage middleware
const uploadCloud    = require('../config/upload-setup/cloudinary')

router.get('/', (req, res, next) =>{
  Room.find()
    .then((rooms) =>{
      res.render('rooms/room-list', {rooms});
    })
    .catch((error) =>{
      console.log(error)
    })
  })

router.get("/add", isLoggedIn, (req, res) => {
  res.render("rooms/create-room");
});

router.post('/add', uploadCloud.single('imageUrl'), (req, res, next) => {
  const { name, description } = req.body;
  const imageUrl = req.file.secure_url;
  const owner    = req.user._id;
  const newRoom = new Room ({name, description, imageUrl, owner})
  newRoom.save()
    .then(movie => {
      res.redirect('/rooms');
    })
    .catch(error => {
      console.log(error);
    })
});


function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else  {
    res.redirect('/login');
  }

}

module.exports = router;



