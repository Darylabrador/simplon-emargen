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

// mongoDB configutation
var configDB = require('./config/database.js');

// error controller 
const errorController = require('./controllers/errorController');
const User            = require('./models/users');

// routes
const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// Add robust session handler
const store = new MongoDBStore({
  uri: configDB.url,
  collection: 'sessions'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Simple session
app.use(
  session({
    name: 'default',
    secret: 'IdHmkktis01rEQ9BDwBgaFfEVV9mZuiIOUazV0Jd',
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

// pass variables locally
app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.currentUserId   = user._id;
      res.locals.isAuthenticated = req.session.isLoggedIn;
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
});

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success');
  res.locals.error_message   = req.flash('error');
  next();
});

// route handler
app.use(authRoutes);
app.use('/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(errorController.get404);

// general error handler (all except 404)
app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.httpStatusCode).render('error', {
    title: 'Une erreur est servenue',
    path: '/errors',
    statusCode: error.httpStatusCode,
    page: ''
  });
});

// Connection to mongoDB using moongose
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('connection to database established successfully');
  })
  .catch(err => {
    console.log('An error occursed ', err);
  });

module.exports = app;