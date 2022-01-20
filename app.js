// import dotenv
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const ordersRouter = require('./routes/orders');
const mediaRouter = require('./routes/media');
const paymentsRouter = require('./routes/payments');
const refreshTokenRouter = require('./routes/refreshToken');

// contoh penggunaan middleware
const verifyToken = require('./middleware/verifyToken');

const app = express();

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', verifyToken, coursesRouter);
app.use('/orders', ordersRouter);
app.use('/media', mediaRouter);
app.use('/payment', paymentsRouter);
app.use('/refresh-token', refreshTokenRouter);

module.exports = app;
