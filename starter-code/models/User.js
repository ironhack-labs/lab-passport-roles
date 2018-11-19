const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ["BOSS", "DEVELOPER", "TA"],
    default: "TA"
  },
  timestamps: {               //to show dates
    createdAt: "created_at", 
    updatedAt: "updated_at"
  }
  
});


  



const User = mongoose.model("User", userSchema);
module.exports = User;



    



