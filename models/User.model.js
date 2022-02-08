const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    profileImg: { type: String, required: true, default: 'https://i.stack.imgur.com/l60Hf.png' },
    description: { type: String, required: true, default: 'No existe descripción.' }
    // add roles setup here
  },
  {
    timestamps: true
  }
);


module.exports = model('User', userSchema)
