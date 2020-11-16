
const mongoose = require('mongoose')
const User = require('../models/user.model')

const dbName = 'bureau-investigation-lab'
mongoose.connect(`mongodb://localhost/${dbName}`)


