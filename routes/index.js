
module.exports = app => {
  app.use('/', require('./auth.routes.js'))
  app.use('/', require('./base.routes.js'))
  app.use('/', require('./students.routes.js'))
  // app.use('/admin', require('./admin.routes.js'))
}