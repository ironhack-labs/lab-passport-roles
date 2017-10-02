const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost/ibi-ironhack";
mongoose.connect(mongoDB, {useMongoClient: true});
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: String,
  familyName: String,
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Boss','Developer', 'TA'],
    default: 'Developer'
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
