var express = require('express');
  path = require('path'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),

  app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8000,
  address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  console.log(res);
  res.status(err.status || 500).json('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, address, function () {
  console.log('Server loaded');
});
