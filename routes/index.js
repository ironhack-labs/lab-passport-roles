module.exports = app => {

    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes.js'))
}