const passport = require("passport");
require('./serializers');
require('./strategies/local');
require('./strategies/slack');

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
