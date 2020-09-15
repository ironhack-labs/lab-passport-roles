module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use('/employees', require('./employees.routes.js'))
    app.use('/auth', require('./auth.routes.js'))
}