const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  // ES MODELO QUE SEGUIRÁN LOS USUARIOS 
  username: String,
  password: String,
  role: {
    //ESTE TYPE LO QUE HACE ES DECIRLE A BOSS , DEVELOPER , TA EN STRING
    type: String,
    enum : ['Boss', 'Developer', 'TA']
  },
},
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User; 