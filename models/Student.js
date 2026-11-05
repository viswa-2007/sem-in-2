
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    IdNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    Marks: {
        type: Number,
        required: true
    },
    Department: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Student", studentSchema);
