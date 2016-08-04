var express = require('express');
  compression = require('compression'),
  fs = require('fs'),
  AdmZip = require('adm-zip'),
  path = require('path'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),

  app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8000,
  address = process.env.OPENSHIFT_NODEJS_IP || '10.0.1.32',
  dataPath = process.env.OPENSHIFT_DATA_DIR || '/tmp/',
  samplesPath = path.join(dataPath, 'samples/'),
  zipPath = path.join(dataPath, 'summaries', 'samples.zip'),
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

app.get('/api/devices', function (req, res) {
  res.sendFile(path.join(dataPath, 'summaries/devices.json'));
});

app.get('/api/summaries', function (req, res) {
  res.sendFile(path.join(dataPath, 'summaries/summary.json'));
});

app.get('/api/raw', function (req, res) {
  var rxValidSampleFileName = /^\d+\.\d+\.txt$/, 
    zip;

  fs.exists(zipPath, function (exists) {
    var options = {
      headers: {
        'Content-Disposition': 'inline; filename="fpstest-raw-samples.zip"'
      }
    };

    if (exists) return res.sendFile(zipPath, options);

    fs.readdir(samplesPath, function (err, files) {
      if (err) return res.status(500).send(err.message);

      zip = new AdmZip();
      files.forEach(function (fileName) {
        if (rxValidSampleFileName.test(fileName)) zip.addLocalFile(path.join(samplesPath, fileName));
      });
      zip.writeZip(zipPath);

      res.sendFile(zipPath, options);
    });

  });
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

fs.unlink(zipPath, function (err) {
  if (err) console.log('No zip file exists. It will be created the first time it is required.');
  else console.log('existing zip file deleted');
  app.listen(port, address, function () {
    console.log('Server loaded');
  });
});
