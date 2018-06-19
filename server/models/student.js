const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: String,
    school: String,
    achievement: String,
    image: { type: String, required: true },
    password: String
});

module.exports = mongoose.model('student', studentSchema, 'students');
