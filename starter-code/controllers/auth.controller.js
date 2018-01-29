const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.index = (req, res, next) => {
    res.render('auth/index');
}

module.exports.login = (req, res, next) => {
    res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.render('auth/login', { 
            user: { username: username }, 
            error: {
                username: username ? '' : 'Username is required',
                password: password ? '' : 'Password is required'
            }
        });
    } else {
        passport.authenticate('local-auth', (error, user, validation) => {
            if (error) {
                next(error);
            } else if (!user) {
                res.render('auth/login', { error: validation });
            } else {
                req.login(user, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.redirect(`/user/${user._id}`);
                    }
                });
            }
        })(req, res, next);
    }
}

module.exports.signup = (req, res, next) => {
    res.render('auth/signup', {
        role: req.user.role
    });
}

module.exports.doSignup = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if(user != null) {
                res.render('auth/signup', {
                    error: { username: 'User already exists'}
                })
            }
            else {
                user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role
                });
                user.save()
                    .then(() => {
                        res.redirect("/login");
                    })
                    .catch(error => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('auth/signup', { 
                                user: user, 
                                error: error.errors 
                            });
                        } else {
                            next(error);
                        }
                    })
            }
        }).catch(error => next(error));
}

module.exports.logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            req.logout();
            res.redirect("/login");
        }
    });
}