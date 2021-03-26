const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A company must have a name'],
      unique: true,
      trim: true,
      validate: [
        validator.isAlpha,
        'A company name must contain only characters',
      ],
    },
    slug: String,
    email: {
      type: String,
      required: [true, 'A company must have an email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      required: [true, 'A company must have a website'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.virtual('employees', {
  ref: 'employee',
  foreignField: 'company',
  localField: '_id',
});

/*Document middleware that runs the 'save event before the document is saved 
in the database only works on save() and create() methods */
companySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const company = mongoose.model('company', companySchema);

module.exports = company;
