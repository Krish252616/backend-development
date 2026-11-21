// Section 7: schema and model.
const mongoose = require('mongoose');

// The sheet's four fields, with simple validation added
const studentSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  age:    { type: Number, min: 15, max: 60 },
  course: { type: String, trim: true },
  marks:  { type: Number, min: 0, max: 100 }
});

// Model 'Student' -> collection 'students' (Mongoose lowercases and pluralises the name)
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
