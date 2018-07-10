const express = require('express');
const passport = require('passport');
const router  = express.Router();
const Course= require('../models/Course');
const checkRole = require('../middleware/checkRole').checkRoles;

router.get('/list', (req,res,next) => {
  Course.find()
  .then(courses => {
    console.log(courses);
    res.render('course/list', {courses});
  })
});

router.get('/add', checkRole('TA'), (req,res,next) => {
    res.render('course/add');
});

router.post('/add', (req, res, next) => {

  const {
    name,
    topic
  } = req.body;

  Course.findOne({
      name
    })
    .then(course => {
      console.log(course);
      if (course !== null) {
        throw new Error("course Already exists");
      }

      const newCourse = new Course({
        name,
        topic
      });

      return newCourse.save()
    })
    .then(course => {
      res.redirect("/course/list");
    })
    .catch(err => {
      console.log(err);
      res.render("course/add", {
        errorMessage: err.message
      });
    })
})

router.get('/edit/:id',checkRole('TA') ,(req,res) => {
  Course.findById(req.params.id).then(course => {
    res.render('course/edit',{course});;
  })
})

router.post('/edit/:id', (req,res) => {
  const { name, topic} = req.body;
  Course.findByIdAndUpdate(req.params.id,{ name, topic })
      .then( course => {
        res.redirect('/course/list')
      })
})


router.get('/remove/:id',checkRole('TA'),(req,res) => {
  Course.findByIdAndRemove(req.params.id, () => res.redirect('/course/list'));
})

module.exports = router;