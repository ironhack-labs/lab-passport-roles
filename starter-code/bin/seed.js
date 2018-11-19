const mongoose = require('mongoose');
const Celebrity = require('../models/Celebrity')

// Connect Mongo a create a database celebrities if doesn't exists
mongoose
	.connect('mongodb://localhost/celebrities', {
		useNewUrlParser: true
	})
	.then(x => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
	})
	.catch(err => {
		console.error('Error connecting to mongo', err)
	});