const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'an employee must have a firstname'],
  },
  lastName: {
    type: String,
    required: [true, 'an employee must have a lastname'],
  },
  slug: String,
  email: {
    type: String,
    required: [true, 'an employee must have an email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
  },
  company: {
    //parent-refrencing the Company Model
    type: mongoose.Schema.ObjectId,
    ref: 'company',
    required: [true, 'Employee must belong to a company'],
  },
});

//'pre' save middleware
employeeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'company',
    select: 'name',
  });
  next();
});

/*Document middleware that runs the 'save event before the document is saved 
in the database only works on save() and create() methods */
employeeSchema.pre('save', function (next) {
  this.slug = slugify(this.firstName, { lower: true });
  next();
});

const employee = mongoose.model('employee', employeeSchema);

module.exports = employee;
