var express = require('express');
  path = require('path'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),

  app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8000,
  address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  Share = require('./lib/share');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/share', function (req, res) {
  var share = new Share(req.body, req.headers['user-agent']);
  share.save()
  .then(() => res.status(200).json({'result': 'success'}))
  .catch(err => res.status(err.status || 500).json({'result': 'error'}));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

app.listen(port, address, function () {
  console.log('Server loaded');
});
