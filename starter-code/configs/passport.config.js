const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
// const FBStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// const DEFAULT_USERNAME = 'Anonymous Coward';

// const FB_CLIENT_ID = process.env.FB_CLIENT_ID || '';
// const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET || '';
// const FB_CB_URL = '/auth/fb/cb';

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
// const GOOGLE_CB_URL = '/auth/google/cb';

// const FB_PROVIDER = 'facebook';
// const GOOGLE_PROVIDER = 'google';

module.exports.setup = (passport) => {

    passport.serializeUser((user, next) => {
        next(null, user._id);
    });

    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(user => {
                next(null, user);
            })
            .catch(error => next(error));
    });

    passport.use('local-auth', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, next) => {
        User.findOne({ username: username})
            .then(user => {
                if (!user) {
                    next(null, user, { password: 'Invalid username or password' });
                } else {
                    user.checkPassword(password)
                        .then(match => {
                            if (match) {
                                next(null, user);
                            } else {
                                next(null, null, { password: 'Invalid username or password' });
                            }
                        })
                        .catch(error => next(error));
                }
            })
            .catch(error => next(error));
    }));

    // passport.use('fb-auth', new FBStrategy({
    //     clientID: FB_CLIENT_ID,
    //     clientSecret: FB_CLIENT_SECRET,
    //     callbackURL: FB_CB_URL,
    //     profileFields: ['id', 'emails']
    // }, authenticateOAuthUser));

    // passport.use('google-auth', new GoogleStrategy({
    //     clientID: GOOGLE_CLIENT_ID,
    //     clientSecret: GOOGLE_CLIENT_SECRET,
    //     callbackURL: GOOGLE_CB_URL
    // }, authenticateOAuthUser));

    // function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
    //     let provider;
    //     if (profile.provider === FB_PROVIDER) {
    //         provider = 'facebookId'
    //     } else if (profile.provider === GOOGLE_PROVIDER) {
    //         provider = 'googleId';
    //     } else {
    //         next();
    //     }
    //     User.findOne({ [`social.${provider}`]: profile.id })
    //         .then(user => {
    //             if (user) {
    //                 next(null, user);
    //             } else {
    //                 const email = profile.emails ? profile.emails[0].value : null;
    //                 user = new User({
    //                     username: email || DEFAULT_USERNAME,
    //                     password: Math.random().toString(36).slice(-8), // FIXME: insecure, use secure random seed
    //                     social: {
    //                         [provider]: profile.id
    //                     }
    //                 });
    //                 console.log
    //                 user.save()
    //                     .then(() => {
    //                         next(null, user);
    //                     })
    //                     .catch(error => next(error));
    //             }
    //         })
    //         .catch(error => next(error));
    // }
 }

 module.exports.isAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
         next()
     } else {
         res.status(401);
         res.redirect('/login');
     }
 }

 module.exports.checkRole = (role) => {
     return (req, res, next) => {
         if (!req.isAuthenticated()) {
             res.status(401);
             //es.redirect('/login');
             res.render('auth/login', {
                 error: { password: 'Only a boss user can sign up new users'}
             })
         } else if (req.user.role === role) {
             next();
         } else {
             res.status(403);
             res.render('error', {
                 message: 'Forbidden',
                 error: {}
             });
         }
     }
 }