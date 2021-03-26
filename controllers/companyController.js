const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const companyModel = require('../models/companyModel');

exports.getCompany = catchAsync(async (req, res, next) => {
  const company = await companyModel
    .findById(req.params.id)
    .populate('employees');

  if (!company) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      company,
    },
  });
});

exports.getAllCompany = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.companyId) filter = { tour: req.params.companyId }; //Nested GET employees on a particular company.
  const features = new APIFeatures(companyModel.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const company = await features.query;
  res.status(200).json({
    status: 'success',
    results: company.length,
    company: company,
  });
});

exports.createCompany = catchAsync(async (req, res, next) => {
  const company = await companyModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      company,
    },
  });
});

exports.updateCompany = catchAsync(async (req, res, next) => {
  const company = await companyModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!company) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      company,
    },
  });
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
  const company = await companyModel.findByIdAndDelete(req.params.id);

  if (!company) {
    return next(new AppError('Document ID does not exist', 404));
  }

  res.status(203).json({
    status: 'success',
    data: null,
  });
});
