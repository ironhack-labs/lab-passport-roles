const express = require('express');
const router  = express.Router();
const User = require( "../models/user-model" );

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user)
  if( !req.user ) {
    res.render('login-form');
    return;
  }
  res.render( "index" );
});



router.post( "/process-login", ( req, res, next ) => {
  const { name, typedPassword } = req.body;

  User.findOne({ name })
  .then(( userDetails ) => {
      if( !userDetails ) {
        res.redirect( "/login-form" );
        return;
      }
      const dbPassword = userDetails.password;
      if( dbPassword !== typedPassword ) {
        res.redirect( "/login-form" );
        return;
      }
      req.login( userDetails, () => {
        console.log( "yay" );
        res.redirect( "/" );
      });
    }
    )
    .catch(( err ) => {
      next( err );
    })
  });

  router.get( "/logout", ( req, res, next ) => {
    req.logout();
    res.redirect( "/" );
  });


router.get( "/user-list", ( req, res, next ) => {
  if( !req.user || req.user.role !== "Boss" ) {
    next();
    return;
  }
  User.find()
    .then(( usersFromDb ) => {
      res.locals.userList = usersFromDb;
      res.render( "user-list" );
    })
    .catch(( err ) => {
      next( err );
    });
});

router.post( "/add-employee", ( req, res, next ) => {
  const { name, password, role } = req.body;

  User.create({ name, password, role })
    .then(() => {
      res.redirect( "/user-list" );
    })
    .catch(( err ) => {
      next( err );
    })
})

module.exports = router;
