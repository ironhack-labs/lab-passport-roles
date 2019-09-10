const {Schema, model} = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  email: String,
  name: String,
  lastname: String,
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA', 'STUDENT']
  }  
}, {
  timestamps: { 
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

// -> usernameField is an optional config. We could define another field as usernamefield, plm use username field by default.
userSchema.plugin(PLM, {usernameField: "email"});
module.exports = model('User', userSchema);