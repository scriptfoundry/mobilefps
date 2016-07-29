var express = require('express');
  compression = require('compression'),
  path = require('path'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),

  app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8000,
  address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  Share = require('./lib/share');

app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/share', function (req, res) {
  var share = new Share(req.body, req.headers['user-agent']);
  share.save()
  .then(function () { res.status(200).json({'result': 'success'}); })
  .catch(function (err) { res.status(err.status || 500).json({'result': 'error'}); });
});

app.get('/devices', function (req, res) {
  res.sendFile(path.join(process.env.OPENSHIFT_DATA_DIR || '/tmp/', 'summaries/devices.json'));
});

app.get('/summaries', function (req, res) {
  res.sendFile(path.join(process.env.OPENSHIFT_DATA_DIR || '/tmp/', 'summaries/summary.json'));
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
  console.error('======start======');
  console.error('Error at      ', new Date().toString());
  console.error('Message:      ', err.message);
  console.error('Url:          ', req.url);
  console.error('Method:       ', req.method);
  console.error('Headers\n', req.headers);
  console.error('Request body:\n', req.body);
  console.error('Stack trace:\n', err.stack);
  console.error('=======end=======');

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

app.listen(port, address, function () {
  console.log('Server loaded');
});
