const
  mongoose = require(`mongoose`),
  Schema = mongoose.Schema,

  courseSchema = new Schema({
    name: String,
    description: String,
  },{
    timestamps: {
      createdAt: `created_at`,
      updatedAt: `updated_at`
    }
  })
;

module.exports = mongoose.model(`Course`, courseSchema);