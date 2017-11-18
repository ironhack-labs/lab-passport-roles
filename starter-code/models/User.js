const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username : { type: String, required: true },
  name : { type: String, required: false },
  password : { type: String, required: true },
  role : { type: String, enum: ['Boss', 'TA', 'Developer','Student'], required: true },
});
