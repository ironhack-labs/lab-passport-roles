module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))

    // Auth URLS
    app.use('/', require('./auth.routes.js'))
}