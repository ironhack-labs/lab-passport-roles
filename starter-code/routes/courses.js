const router = require('express').Router()
const Course = require('../models/Course')

router.get('/view-courses', async (req, res, next) => {
  try {
    const course = await Course.find().populate('author')
    let user = null
    if (req.user) {
      user = req.user.role === 'TA'
    }
    //   if (user) {
    //     const config = true
    //   } else {
    //     const config = false
    //   }
    res.render('course/view-course', {
      course, user
    })
  }
  catch (err) {
    console.log(err)
    //res.send('User already exists')
  }
})

router.get('/create-course', (req, res, next) => {
  res.render('course/create-course')
})

router.post('/create', async (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'TA') {
    const { title, desc } = req.body
    const { _id } = req.user
    await Course.create({ title, desc, author: _id })
    res.redirect('/view-courses')
  } else {
    res.redirect('/login')
  }


  // try {
  //   if (req.isAuthenticated() && req.user.role === 'TA') {
  //     const { title, desc } = req.body
  //     const { _id } = req.user
  //     await Course.create({ title, desc, author: _id })
  //     res.redirect('/view-course')
  //   } else {
  //     res.redirect('/login')
  //   }
  // }
  // catch (err) {
  //   console.log(err)
  //   //res.send('User already exists')
  // }
})

router.get('/delete/:id', async (req, res, next) => {
  try {
    if (req.isAuthenticated() && req.user.role === 'TA') {
      const { id } = req.params
      await Course.findByIdAndDelete(id)
      res.redirect('/view-courses')
    } else {
      res.redirect('/login')
    }
  }
  catch (err) {
    console.log(err)
    //res.send('User already exists')
  }
})


module.exports = router