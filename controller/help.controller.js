const mail = require('../services/mailer.service');

module.exports.create = (req, res, next) =>{
    res.render('help/create');
};

module.exports.doCreate = (req, res, next) =>{
    mail.helpEmail(req.body);
    res.redirect('/');
};


