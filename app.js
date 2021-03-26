//configurations for app, handles everything related to express configs
const express = require('express');

const path = require('path');

const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const AppError = require('./utils/appError');
const companyRouter = require('./routes/companyRoute')
const employeeRouter = require('./routes/employeeRoute')
const userRouter = require('./routes/userRoute')
const viewRouter = require('./routes/viewRoute')
// const globalErrorHandler = require('./controllers/errorController');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //third-party middleware for logging functionality i.e logging req status in the terminal
}

app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); //body-parser for telling that the incoming request body is a JSON Object



//ROUTES MIDDLEWARE
app.use('/', viewRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/user', userRouter);

//Error Handling for non-existent routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

/*This is our global error handling middlware that comes along with express, when an err is discovered
it is sent to the the err middlware and the response is run from there*/
// app.use(globalErrorHandler);

module.exports = app;
