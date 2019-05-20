const express = require('express');
const router = express.Router();
const Course = require('../../models/course.model')



/* GET home page */
const isTA = req => {
  if (req.user.role === 'TA') return true
}

router.get('/', (req, res, next) => {
  Course.find()
    .then(courses => {
      console.log(courses)
      res.render('courses/index', {
        courses, ta: isTA(req)
      });
    })
    .catch(err => {
      next()
      return err
    })
});


router.get('/:id', (req, res) => {
  Course.findById(req.params.id)
    .then(course => {
      console.log(course.startDate)
      res.render('courses/show', {
        course,
        ta: isTA(req)
      })
    })
})

router.post('/:id', (req, res) => {
  if (!isTA(req)){
    return
  }
  const {
    title,
    duration,
    startDate
  } = req.body

  Course.findByIdAndUpdate(req.params.id, {
      title,
      duration,
      startDate
    })
    .then(course => {
      console.log('course updated', course)
      res.redirect('/courses')
    }).catch(err => {
      next()
      return err

    })
})

router.get('/add/new', (req, res) => {
    if (!isTA(req)) {
      return
    }
  res.render('courses/new')
})
router.post('/add/new', (req, res) => {
  if (!isTA(req)) {
    return
  }
  const {
    title,
    duration,
    startDate
  } = req.body

  const newCourse = new Course({
    title,
    duration,
    startDate
  })
  newCourse.save()
    .then(
      course => {
        res.redirect('/courses')
      }
    )
    .catch(err => {
      res.render('courses/new', {
        errmsg: "There was an error, try again"
      })
    })
})


router.get('/:id/delete', (req, res) => {
  if (!isTA(req)) {
    return
  }
  Course.findByIdAndDelete(req.params.id)
    .then(course => {
      console.log(course)
      res.redirect('/courses')
    })
    .catch(err => {
      console.log(err)
      next()
      return err
    })
})


router.get('/:id/edit', (req, res) => {
  Course.findById(req.params.id)
    .then(course => {
      res.render('courses/edit', {
        course
      })
    })
})
module.exports = router;
