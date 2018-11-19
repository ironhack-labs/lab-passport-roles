const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.get('/private', checkRoles('BOSS'), (req, res) => {
  res.render('private', {user: req.user});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


router.get('/employees/add', (req, res, next) => {
  res.render("employees");
});



router.post('/employees/add', (req, res, next) => {
  const { firstName, secondName } = req.body;
  const newEmployee = new Employee({ firstName, secondName})
  newEmployee.save()
  .then((book) => {
    res.redirect('/employees');
  })
  .catch((error) => {
    console.log(error);
  })
});


module.exports = router;
