var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('ejs-mate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog"); // Import routes for "catalog" area of site.

var app = express();
//Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery',false); //Allow data pass to model constructor can be outside the schema.
const mongoDBConnectionString = "mongodb+srv://phamtienphat123:@cluster0.8tuhqls.mongodb.net/?retryWrites=true&w=majority"

async function main(){
  await mongoose.connect(mongoDBConnectionString);
}
main().catch(err => console.log(err));

// use ejs-mate for all ejs templates:
app.engine('ejs',engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
 

