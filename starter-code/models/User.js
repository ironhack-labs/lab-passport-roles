const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username : { type: String, required: true },
  name : { type: String, required: false },
  password : { type: String, required: true },role : { type : String, enum : [ 'Boss', 'Developer', 'TA', 'Student' ], default : 'Student' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
