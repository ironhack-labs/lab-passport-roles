const express = require('express');
const router = express.Router();
const Course = require("../models/courses.model")

const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", {
  //     roleErrorMessage: `you have to be a ${role} to enter this area` // no me sale los mensajes de error
})


router.get('/courses', checkRole('TA'), (req, res) => {
  Course.find()
    .then(allCourses => res.render('courses', {
      courses: allCourses
    }))
    .catch(err => console.log("Error finding all courses", err))
});


router.get('/delete-course/:id', (req, res) => {
  Course.findByIdAndDelete(req.params.id)
    .then(oneCourse => res.redirect('courses', {
      deleteCourse: oneCourse
    }))
    .catch(err => console.log("Error deleting course: ", err))
});

router.get('/add-course', (req, res) => res.render('add'))

router.post('/add-course', (req, res) => {

  const {
    name,
    occupation,
    catchPhrase,
  } = req.body

  Course.create({
      name,
      occupation,
      catchPhrase,
    })
    .then(x => res.redirect('/course'))
    .catch(err => 'error with creating course', err)
})

router.get("/edit-course/:id", (req, res) => {
  Course.findById(req.params.id)
    .then(courseEdit => res.render('edit-course', {
      edit: courseEdit
    }))
    .catch(err => console.log('error editing ', err))
});
router.post("/edit-course/:id", (req, res) => {
  const {
    name,
    teacher,
    duration
  } = req.body;
  Course.findOneAndUpdate(req.params.id, {
      name,
      teacher,
      duration
    })
    .then(res.redirect("/courses"))
    .catch(err => console.log("error editing course", err));

})
module.exports = router