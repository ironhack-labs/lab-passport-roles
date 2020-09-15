module.exports = app => {

    // Base URLS
    app.use('/', require('./auth.routes'))
    app.use('/', require('./base.routes.js'))
}