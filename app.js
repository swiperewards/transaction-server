var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require(path.resolve('./', 'config'));

var index = require('./routes/index');
var merchantRoutes=require(path.resolve('.','modules/merchant/merchantRoutes'));
var configRoutes=require(path.resolve('.','modules/config/configRoutes'));
var entityRoutes=require(path.resolve('.','modules/entity/entityRoutes'));
var memberRoutes=require(path.resolve('.','modules/member/memberRoutes'));
var accountRoutes=require(path.resolve('.','modules/account/accountRoutes'));
var cronController=require(path.resolve('.','modules/cron/cronController'));
var customerRoutes=require(path.resolve('.','modules/customer/customerRoutes'));
var poolRoutes=require(path.resolve('.','modules/pool/poolRoutes'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', index);

//log all the requests
app.use(morgan('dev'));
//app.use(morgan('combined'));

app.use("/merchant", merchantRoutes);
app.use("/config", configRoutes);
app.use("/entity", entityRoutes);
app.use("/member", memberRoutes);
app.use("/account", accountRoutes);
// app.use(cronController);
app.use("/customer", customerRoutes);
app.use("/pool", poolRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
