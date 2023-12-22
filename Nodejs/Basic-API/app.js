var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuidv4 = require('uuid');
var models = require('./model/index.js');
const users = require('./model/index.js');
//import { v4 as uuidv4 } from 'uuid';
//import { Express } from 'express';
//Import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Testing whether module object contain users and messages
//console.log(users);
//console.log(module.exports);
//console.log(models.messages);
app.use((req, res, next) => {
  //Put the first user to the request object
  //Transfer to the next middleware
  req.context = {
    models,
    me: models.users[1],
  }
  next();
})

//Mounting process
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);


app.listen(3000, () => console.log(`Basic API app listening on port 3000`));

module.exports = app;
