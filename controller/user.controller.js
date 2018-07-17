const User = require("../models/user.model");
const Course = require("../models/course.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports.profile = (req, res, next) =>{
  const idFriend = req.params.id;
  
  const id = req.user.id; //el logeado
  
  if (idFriend) {
    User.findById(idFriend)
    .then(user =>{
      res.render('users/profile', {user:user});
    })
    .catch(error =>{
      next(error);
    });
  } else if(id){
    User.findById(id)
    .then(user =>{
      res.render('users/profile', {user:user});
    })
    .catch(error =>{
      next(error);
    });
  }
};

module.exports.list = (req, res, next) =>{
  User.find()
  .then(users =>{
    res.render('users/list', {users:users});
  })
  .catch(error =>{
    next(error);
  });
  // Course.find()
  // .then()
};

module.exports.create = (req, res, next) => {
  res.render("users/create");
};

module.exports.doCreate = (req, res, next) =>{  
  const newUser = new User(req.body);
  
  User.findOne({username:newUser.username}) 
  .then(user=>{    
    if (user) {     
      res.render('users/create', {user:newUser, errors: {username:`User exists, log in instead`}});
      console.log('user exists');
    } else{                  
      newUser.save() // !!! Antes de este save paso por el pre save del model para encriptarlo!!!
      .then((user)=>{ 
        res.redirect('/sessions/create'); // ira al middleware y debera logearse primero
        console.log('user created'); 
      })
      .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {                    
          res.render('users/create', {user:newUser, errors: error.errors});
        } else{          
          next(error);
        }
      });      
    }
  })
  .catch(error =>{
    if (error instanceof mongoose.Error.CastError) {      
      next(createError(404, `cast error`));
    } else{      
      next(error);
    }
  });
};

module.exports.createUser = (req, res, next) =>{
  res.render('users/update', {user: new User()});
};

module.exports.doCreateUser = (req, res, next) =>{
  const newUser = new User(req.body);
  console.log(newUser);
  
  User.findOne({username: req.body.username})
  .then(user =>{
    if (user) {
      res.render('users/update', {errors: {username: 'Username exists'}});
      console.log('boss exists');
    } else{
      newUser.save()
      .then(user =>{   
        res.redirect('/users/list');
        console.log('user saved');
      })
      .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
          res.render('users/update', {errors: error.errors});
        } else{
          next(error);
        }
      });
    }
  })
  .catch(error =>{
    next(error);
  });
};



module.exports.update = (req, res, next) =>{
  const id = req.params.id;
  User.findById(id)
  .then(user =>{
    if (user) {
      res.render('users/update', {user});
    } else{
      next(createError(404, `user not found`));
    }
  })
  .catch(error =>{
    next(error);
  });
};

module.exports.doUpdate = (req, res, next) => {
  console.log('do update');
  
  const id = req.params.id;
  
  User.findById(id)
  .then(user => {
    if (user) {
      Object.assign(user, req.body);
      
      user.save()
      .then(() => {
        res.redirect(`/users/${id}/`);
      })
      .catch(error => {        
        if (error instanceof mongoose.Error.ValidationError) {
          res.render('users/update', { user: user, errors: error.errors});
        } else {
          next(error);
        }
      });
    } else {
      next(createError(404, `User not found`));
    }
  })
  .catch(error => next(error));
};


module.exports.inscribirme = (req, res, next) =>{
  const idCourse = req.params.idCourse;
  const idUser = req.params.idUser;

  Course.findById(idCourse)
  .then(course =>{
      if (course) {
          User.findById(idUser)
          .then(user=>{
            course.students.push(user);
            return course.save();
          })
          .then(()=>{
            res.redirect('/courses/list')
          })
          .catch(error =>{
            if (error instanceof mongoose.Error.CastError) {
              next(404, `user not found`);
            } else{
              next(error);
            }
          }); 
      } else{
          next(createError(404, `course not found`));
      }
  })
  .catch(error =>{
      next(error);
  });
 
};



module.exports.doDelete = (req, res, next) =>{
  const id = req.params.id;
  
  User.findByIdAndRemove(id)
  .then(user =>{
    res.status(200).redirect('/users/list');
  })
  .catch(error =>{
    next(error);
  });
};


