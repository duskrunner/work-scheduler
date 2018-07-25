const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const {syncWithSylvia} = require('./seeders/silviaSQL');
const schedule = require('node-schedule');

require('./models/User');
require('./models/Todo');
require('./models/TodoHistory');
require('./handlers/passport');
require('dotenv').config({path: '../variables.env'});


const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

const index = require('./routes/index');
const oftlMap = require('./routes/oftl-map');
const sites = require('./routes/sites');
const site = require('./routes/site');
const users = require('./routes/users');
const register = require('./routes/register');
const logout = require('./routes/logout');
const api = require('./routes/api');
const todo = require('./routes/todo');


const app = express();


schedule.scheduleJob('30 8 * * *', syncWithSylvia);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.h = helpers;
    res.locals.currentPath = req.path;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    next();
});


app.use('/', index);
app.use('/oftl-map', oftlMap);
app.use('/sites', sites);
app.use('/site', site);
app.use('/login', users);
app.use('/register', register);
app.use('/logout', logout);
app.use('/todo', todo);

// API

app.use('/api', api);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandlers.validationError);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
