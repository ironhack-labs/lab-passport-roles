const {Schema, model} = require('mongoose');
const courseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = model('Course', courseSchema);
