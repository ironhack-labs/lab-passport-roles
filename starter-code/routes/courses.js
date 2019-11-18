const express = require('express');
const router = express.Router();
const courses = require("../models/Course");

/* GET home page */
router.get('/', (req, res, next) => {
  courses.find()
    .then((coursesFound) => {
      res.render('courses/index', { coursesFound })
    })
});

// router.get('/:id', (req, res, next) => {
//   courses.findOne({ _id: req.params.id })
//     .then((courseFound) => {
//       res.render('courses/show', courseFound)
//     })
//     .catch(() => {
//       next()
//     })

// });


router.post('/:id', (req, res, next) => {
  courses.updateOne(
    {_id: req.body.id},
    {
        title: req.body.title,
        description: req.body.description
      
      }
    )
    .then(()=>{
      res.redirect('/courses')
    })

})

router.post('/:id/edit', (req, res, next) => {
  courses.findOne({ _id: req.body.id })
    .then((course) => {
      res.render('courses/edit', course)
    })
    .catch(() => {
      next()
    })
});

router.post('/:id/delete', (req, res, next) => {
  courses.findByIdAndRemove(req.body.id)
    .then(() => {
      res.redirect('/courses')
    })
    .catch(() => {
      next()
    })
});


router.get('/new', (req, res, next) => {
  res.render('courses/new')

});

router.post('/', (req, res, next) => {
  courses.create({
    title: req.body.title,
    description: req.body.description
    
  })
    .then(() => {
      res.redirect('/courses')
    })
});

module.exports = router;