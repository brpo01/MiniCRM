const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures')

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!this.updateUser) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(userModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const user = await features.query;
  res.status(200).json({
    status: 'success',
    results: user.length,
    user: user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'use /signup instead'
  });
});

//NB- this is for updating details about a user, not for updating password
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('Document ID does not exist', 404));
  }

  res.status(203).json({
    status: 'success',
    data: null,
  });
});
