const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const employeeModel = require('../models/employeeModel');

// exports.setCompanyIds = (req, res, next) => {
//   if (!req.body.company) req.body.company = req.params.companyId;
//   next();
// };

exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await employeeModel.findById(req.params.id);

  if (!employee) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      employee,
    },
  });
});

exports.getAllEmployee = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(employeeModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const employee = await features.query;
  res.status(200).json({
    status: 'success',
    results: employee.length,
    employee: employee,
  });
});

exports.createEmployee = catchAsync(async (req, res, next) => {
  const employee = await employeeModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      employee,
    },
  });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  const employee = await employeeModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!employee) {
    return next(new AppError('Company ID does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      employee,
    },
  });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await employeeModel.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(new AppError('Document ID does not exist', 404));
  }

  res.status(203).json({
    status: 'success',
    data: null,
  });
});
