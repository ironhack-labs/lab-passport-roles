const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

const isAuth = (req, res, next) => {

  if ( req.isAuthenticated() ) return next();

  let error = 'Please log in';
  return res.render('passport/login', { error });

}

const checkRole = roles => {

  return (req, res, next) => {

    if ( roles.includes(req.user.role) ) return next();

    const { user } = req;
    return res.render('not-authorized', { user });

  }

}

router.get('/courses', isAuth, checkRole(['TA','Alumni']), (req, res, next) => {

  const { user } = req;

  Course.find()
  .then( courses => res.render('courses/index', { user, courses }) )
  .catch( error => console.log(error) );

});

router.post('/courses', isAuth, checkRole('TA'), (req, res, next) => {

  const { user } = req;
  const { name } = req.body;

  if ( !name ) {
    error = 'Please enter the name of the course';
    return res.render('courses/new', { user, error });
  }

  const newCourse = new Course({ name, teacherId: user._id });

  newCourse.save()
  .then( course => res.redirect('/courses') )
  .catch( error => {
    
    console.log(`Teacher ID: ${user._id}`);
    res.render('courses/new', { user, error });
  })
    
});

router.get('/courses/new', isAuth, checkRole('TA'), (req, res, next) => {

  const { user } = req;
  res.render('courses/new', { user });

});

router.get('/courses/:courseId', isAuth, checkRole(['TA','Alumni']), (req, res, next) => {

  const { user } = req;
  const courseId = req.params.courseId;

  Course.findById(courseId)
  .then( course => res.render('courses/show', { user, course }))
  .catch( error => console.log(error) )

});

router.post('/courses/:courseId', isAuth, checkRole('TA'), (req, res, next) => {

  const { user } = req;
  const courseId = req.params.courseId;
  const { name } = req.body;

  if ( !name ) return res.redirect(`/courses/${courseId}/edit`);

  Course.update( {_id: courseId}, {$set: {name}} )
  .then( courseToMod => {
    console.log('Updated course');
    res.redirect('/courses')
  })
  .catch( error => res.render('courses', {user, error}));

})

router.get('/courses/:courseId/edit', isAuth, checkRole(['TA','Alumni']), (req, res, next) => {

  const { user } = req;
  const courseId = req.params.courseId;

  Course.findById(courseId)
  .then( course => res.render('courses/edit', { user, course }))
  .catch( error => console.log(error))

});

router.post('/courses/:courseId/add',  isAuth, checkRole('TA'), (req, res, next) => {

  const courseId = req.params.courseId;

  Course.findByIdAndDelete(courseId)
  .then( course => res.redirect('/courses') )
  .catch( error => console.log(error) );

});

router.post('/courses/:courseId/delete',  isAuth, checkRole('TA'), (req, res, next) => {

  const courseId = req.params.courseId;

  Course.findByIdAndDelete(courseId)
  .then( course => res.redirect('/courses') )
  .catch( error => console.log(error) );

});


module.exports = router;