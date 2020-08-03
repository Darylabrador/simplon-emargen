const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');

const mongoose     = require('mongoose');
const dotenv       = require('dotenv').config();
const session      = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash        = require('connect-flash');
const helmet       = require('helmet');

// error controller 
const errorController = require('./controllers/errorController');

const app = express();

// Add robust session handler
const store = new MongoDBStore({
  uri: configDB.url,
  collection: 'sessions'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Simple session
app.use(
  session({
    name: 'default',
    secret: 'asq4b4PRJhpo025HjqeZaEasdz68D',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: true,
      maxAge: 3600 * 1000 * 3
    }
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success');
  res.locals.error_message   = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(errorController.get404);

// general error handler (all except 404)
app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.httpStatusCode).render('error', {
    title: 'Une erreur est servenue',
    path: '/errors',
    statusCode: error.httpStatusCode
  });
});

module.exports = app;
