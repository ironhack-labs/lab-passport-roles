const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: { type: String, required: [true, 'A dónde vas sin nombre cuerpo escombro?'] },
  name: String,
  familyName: String,
  password: String,
  role: String,

}, {
timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
