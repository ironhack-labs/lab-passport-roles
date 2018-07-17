const constants = require('../constants');
const express = require('express');
const app = express();

module.exports = (hbs) => {

    hbs.registerHelper('json', function(context){
        return JSON.stringify(context);
    });

    hbs.registerHelper('isBOSS', (context, options) =>{
        if (context.role === constants.users.BOSS) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });

    hbs.registerHelper('isTA', (context, options) =>{
        if (context.role === constants.users.TA) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });

    hbs.registerHelper('isDEVELOPER', (context, options) =>{
        if (context.role === constants.users.DEVELOPER) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });
}; 


