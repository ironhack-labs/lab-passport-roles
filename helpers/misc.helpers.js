const constants = require('../constants');
const express = require('express');
const app = express();

module.exports = (hbs) => {

    hbs.registerHelper('json', function(context){
        return JSON.stringify(context);
    });

    hbs.registerHelper('isAdmin', (context, options) =>{
        if (context.role === constants.BOSS) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });

    hbs.registerHelper('isTA', (context, options) =>{
        if (context.role === constants.TA) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });
}; 


