const companyModel = require('../models/companyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const employeeModel = require('../models/employeeModel');

exports.getCompany = catchAsync(async (req, res) => {
  const companies = await companyModel.find();
  res.status(200).render('company', {
    title: 'All Companies',
    companies,
  });
});

exports.getEmployees = catchAsync(async (req, res, next) => {
  const companies = await companyModel
    .findOne({ slug: req.params.slug })
    .populate({
      path: 'employees',
      select: 'firstName lastName email',
    });

  if (!companies) {
    next(new AppError('Sorry, that company does not exist', 404));
  }

  res.status(200).render('employee', {
    title: `${companies.name} | Employees`,
    companies,
  });
});

exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log in into your Account',
  });
});
