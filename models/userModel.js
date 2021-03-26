const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please input your password'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'You must either be a user or an admin',
    },
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'Please input a password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//middleware for encypting your password, when a user is created
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //hash password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //set passwordConfirm to undefined
  this.passwordConfirm = undefined;
  next();
});

//compare the userpassword in the db and the inputed password to see if they match, to give access to user
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //check if the password was changed after the token was issued
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(JWTTimestamp, changedTimeStamp)
    return JWTTimestamp < changedTimeStamp;
  }

  //if password wasn't changed after token was issued
  return false;
};

const user = mongoose.model('user', userSchema);

module.exports = user;
