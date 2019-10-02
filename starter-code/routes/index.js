const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const Course = require("../models/Course")


// ============================================ HOME PAGE ================================================
router.get('/', (req, res, next) => {  
  res.render('index', {user: req.user});
});

// ============================================== PROFILE LIST ================================================
router.get('/profile-list', (req, res, next) => {
  User.find()
    .then(user => {      
      res.render('profile-list', { user });
    })
    .catch(err => {throw new Error(err)});
});
// =================================================COURSE CREATION==========================================
router.get('/createcourse', (req, res, next) => {
  res.render('create-course')
})
  
router.post('/createcourse', (req, res, next) => {
  const { title, category, description } = req.body;
  
  const newCourse = new Course({
    title,
    category,
    description
  });

  newCourse.save((err) => {
    if (err) {
      res.render("/createcourse", { message: "Something went wrong" });
    } else {
      res.redirect("/listcourses");
    }
  })
})

// ==============================================LIST COURSE=====================================================
router.get('/listcourses', (req, res, next) => {
  Course.find()
    .then(course => {
      res.render('list-courses', { course })
    })
    .catch(err => {throw new Error(err)});
})



module.exports = router;
