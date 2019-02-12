const router = require('express').Router()
const Course = require('../models/Course')

const isTA = (req, res, next) => {
  if(!req.user) return res.redirect('/')
  if (req.user.role === 'TA') return next()
  req.logOut()
  return res.redirect('/')
}

// Logout
router.get('/logout', (req, res, next) => {
  req.logOut()
  return res.redirect('/')
})

// Delete
router.get('/delete/:id', isTA, (req, res, next) => {
  const { id } = req.params
  Course.findByIdAndDelete(id)
    .then(()=> res.redirect('/gm'))
    .catch(e=> next(e))
})

// Edit

router.post('/edit/:id', isTA, (req, res, next) => {
  const {id} = req.params
  Course.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(() => {
      res.redirect('/ta')
    })
  .catch(e=> next(e))
})
router.get('/edit/:id', isTA, (req, res, next) => {
  const { id } = req.params
  Course.findById(id)
    .then(course => {
  const config = {
    title: 'Edit ',
    action: `/ta/edit/${id}`,
    submit: 'Update',
    courseTitle: course.title,
  }
  res.render('ta/new', isTA, config)
    })
  .catch(e=> next(e))
})

// Add new
router.post('/new', isTA, (req, res, next) => {
  Course.create({ ...req.body })
    .then(() => {
      res.redirect('/ta')
    })
    .catch(e => next(e))
});

router.get('/new', isTA, (req, res, next) => {
  const config = {
    title: 'Add new course',
    action: '/ta/new',
    submit: 'Create new',
    courseTitle: '',
  }
  res.render('ta/new', config)
});

//  List
router.get('/', (req, res, next) => {
  Course.find()
    .then(courses => res.render('ta/ta', {courses}))
    .catch(e=> next(e))
})

module.exports = router