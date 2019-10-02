const express = require('express');
const router  = express.Router();
const User = require('../models/User');

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

/* GET home page */
router.get('/', (req, res, next) => {

  const { user } = req;
  res.render('index', { user });

});

router.get('/users', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  const { user } = req;

  User.find()
  .then( users => {

    res.render('users/index', { user, users });

  })
  .catch( error => console.log(error) );

});

router.post('/users', isAuth, checkRole('Boss'), (req, res, next) => {

  const { user } = req;
  const { email, password, displayName, role } = req.body;
  let error;

  if ( password !== req.body['confirm-password'] ) {
    error = 'Make sure to enter the same password';
    return res.render('users/new', { user, error });
  }

  if ( !email || !password ) {
    error = 'Please enter email or password';
    return res.render('users/new', { user, error });
  }

  User.register({ email, displayName, role }, password)
  .then( user => res.redirect('/users') )
  .catch( error => res.render('users/new', { user, error }));

})

router.get('/users/new', isAuth, checkRole('Boss'), (req, res, next) => {

  const { user } = req;
  res.render('users/new', { user });

});

router.get('/users/:userId', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  const { user } = req;
  const userId = req.params.userId;

  User.findById(userId)
  .then( foundUser => {
    console.log(`Current User: ${user._id}, Profile User: ${foundUser._id}`);
    console.log(`Typeof User: ${typeof user._id}, Profile User: ${typeof foundUser._id}`);
    res.render('users/show', { user, foundUser })
  })
  .catch( error => console.log(error) );
  
});

router.post('/users/:userId', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  const { user } = req;
  const userId = req.params.userId;
  const { email, displayName, role } = req.body;
  let error;

  if ( !email ) {
    error = 'Please enter email';
    return res.redirect(`/users/${userId}/edit`);
  }

  User.update({_id: userId}, {$set: {email, displayName, role} })
  .then( userToMod => {
    console.log('Updated user')
    res.redirect('/users');
  })
  .catch( error => res.render(`users`, { user, error}))

})

router.get('/users/:userId/edit', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  const { user } = req;
  let userId = req.params.userId;
  let currentUserId = JSON.stringify(user._id);

  console.log(`Current User: ${currentUserId}, Profile User: ${userId}`);
  console.log(`Typeof User: ${typeof currentUserId}, Profile User: ${typeof userId}`);

  if ( currentUserId === JSON.stringify(userId) || user.role === 'Boss' ) {

    User.findById(userId)
    .then( foundUser => res.render('users/edit', {user, foundUser}) )
    .catch( error => console.log(error) );

  } else {

    const { user } = req;
    return res.render('not-authorized', { user });

  }

});

router.post('/users/:userId/delete',  isAuth, checkRole('Boss'), (req, res, next) => {

  const userId = req.params.userId;

  User.findByIdAndDelete(userId)
  .then( user => res.redirect('/users') )
  .catch( error => console.log(error) );
  
});

router.get('/students', isAuth, (req, res, next) => {

  const { user } = req;

  User.find({ role: 'Student' })
  .then( students => res.render('students/index', { user, students }) )
  .catch( error => console.log(error) );

});

router.get('/students/:studentId', isAuth, (req, res, next) => {

  const { user } = req;
  let studentId = req.params.studentId;

  User.findById(studentId)
  .then( student => res.render('students/show', { user, student }) )
  .catch( error => console.log(error) );

});

router.post('/students/:studentId/delete', isAuth, checkRole(['Boss','TA']), (req, res, next) => {

  const { user } = req;
  let studentId = req.params.studentId;

  User.findByIdAndDelete(studentId)
  .then( student => res.redirect('/students') )
  .catch( error => console.log(error) );

});

module.exports = router;
