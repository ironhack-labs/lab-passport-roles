const User = require("../models/user.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');

module.exports.create = (req, res, next) => {
    res.render("sessions/create");
};


//NORMAL=>

// module.exports.doCreate = (req, res, next) => {
//     if (!req.body.username || !req.body.password) {
//        console.log('empty');
//         res.render("sessions/create", {errors: {username: "username must not be empty", password: "password must not be empty"}});
//     } else {
//         User.findOne({ username: req.body.username }) 
//         .then(user => {
//             if (user) {
//                 user.checkPassword(req.body.password)
//                 .then(match =>{
//                     if (match) {
//                         console.log('logged');
//                         req.session.currentUser = user;
//                         res.redirect('/');
//                     }else{
//                         res.render('sessions/create', {errors:{password:'wrong passrowd'}});
//                     }
//                 })
//                 .catch(error =>{
//                     next(error);
//                 });

//             } else {
//                 res.render("/sessions/create", {error: 'username not found'});
//             }
//         })
//         .catch(error => {
//             if (error instanceof mongoose.Error.CastError) {
//                 next(createError(404, `not a valid username`));
//             } else {
//                 next(error);
//             }
//         });
//     }
// };


// //PASSPORT =>
module.exports.doCreate = (req, res, next) =>{    
    
    function renderWithErrors(errors){
        res.status(400).render('sessions/create', {errors: errors});
    } 
    
    const { username, password } = req.body;
    if (!username || !password) {
        renderWithErrors({
            username: 'username must not be empty',
            password: 'password must not be empty',
        });
    } else{
        //middleware aqui en lugar de routes???
        passport.authenticate('local-auth', (error, user, validation) =>{
            if (error) {
                next(error); //salta a ultimo use
            } else if(!user){
                res.render('sessions/create', {errors:validation});
            } else{
                req.login(user, (error) =>{
                    if (error) {
                      next(error);  
                    } else{
                        res.status(200).redirect('/');
                        // console.log('USER LOGGED ID: ' + req.session.passport.user);
                        // console.log('USER LOGGED ENTERO: ' + req.user);
                    }
                });
            }
        })(req, res, next);
    }
};



module.exports.doDelete = (req, res, next) =>{
    req.session.destroy(()=>{
        console.log('destroy session');
        res.redirect('/sessions/create');
    });
};
