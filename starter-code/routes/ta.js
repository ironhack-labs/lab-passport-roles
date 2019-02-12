let router = require('express').Router()
let Course = require('../models/Course')

let isTA = (req, res, next) => {
  if (!req.user) return res.redirect('/')
  if (req.user.role === 'TA') return next()
  return res.redirect('/')
}

router.get('/delete/:id', isTA, (req, res, next) => {
  let {id} = req.params
  Course.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/ta')
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.post('/edit/:id', isTA, (req, res, next) => {
  let {id} = req.params
  Course.findByIdAndUpdate(id, {...req.body}, {new: true})
    .then(() => {
      res.redirect('/ta')
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.get('/edit/:id', isTA, (req, res, next) => {
  let {id} = req.params
  Course.findById(id)
    .then(course => {
      let config = {
        title: 'Edit course',
        action: `/ta/edit/${id}`,
        submit: 'Update',
        title: course.title,
        difficulty: course.difficulty,
      }
      res.render('ta/create', config)
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.get('/create', isTA, (req, res, next) => {
  let config = {
    title: 'Create course',
    action: '/ta/create',
    submit: 'Create new',
    title: '',
    difficulty: '',
  }
  res.render('ta/create', config)
})

router.post('/create', isTA, (req, res, next) => {
  Course.create({...req.body})
    .then(user => {
      res.redirect('/ta')
    })
    .catch(err => {
      req.app.locals.error = err
      res.redirect('/ta')
    })
})

router.get('/', isTA, (req, res, next) => {
  Course.find()
  .then(courses => {
    res.render('ta/ta', {courses})
  })
  .catch(err => {
    req.app.locals.error = err
  })
})

module.exports = router
