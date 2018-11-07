const passport = require('passport');

require('./serializers');
require('./localStrategy');
// require('./facebookStrategy');
require('./googleStrategy')

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
}
