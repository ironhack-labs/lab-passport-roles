module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes.js'))
    //app.use('/platform', require('./platform.routes.js'))  si activo esta ruta me da un error de Modules Not found
    
}