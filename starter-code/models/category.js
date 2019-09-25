// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const schema = new Schema({
  name: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Category = mongoose.model("Category", schema);

module.exports = Category;