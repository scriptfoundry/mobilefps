/* global process */
var fs = require('fs'),
    when = require('when'),
    collectedTests = ['baseline', 'canvas', 'css', 'dom', 'touch'],
    savePath = [process.env.OPENSHIFT_DATA_DIR || '/tmp/', 'samples/'].join('');

var clean = function (input) {
    if (typeof input != 'string') return 'non-string data';
    return input.replace(/[^a-z0-9 _/\.-]*/ig, '');
};
var sum = function (values) { return values.reduce(function (carry, val) { return carry + val; }, 0); };
var getMin = function (values) { return values.reduce(function (carry, val) { return val < carry ? val : carry; }, Number.MAX_VALUE); };
var getMax = function (values) { return values.reduce(function (carry, val) { return val > carry ? val : carry; }, Number.MIN_VALUE); };
var average = function (values) { return sum(values) / values.length; };
var squareDiffs = function (values, avg) { return values.map(function (val) { var diff = val - avg; return diff * diff; }); };
var getStandardDeviation = function (values) {
    var avg = average(values),
        sqd = squareDiffs(values, avg),
        avgSquareDiff = average(sqd);

    return Math.sqrt(avgSquareDiff);
};
var toPrecision = function (value, precision) {
    var factor = Math.pow(10, precision);

    return Math.round(value * factor) / factor;
};



var Share = function (data, userAgent) {
    this.time = process.hrtime().join('.');
    this.userPlatform = clean(data.userPlatform || '');
    this.device = {maker: clean(data.device.maker), model: clean(data.device.model), agent: clean(userAgent)};
    this.screen = data.screen.map(function (datum) { return typeof datum == 'number' ? datum : null; });

    this.samples = collectedTests.map(function (test) {
        var samples = data.samples[test].filter(function (sample) { return typeof sample === 'number'; }),
            avg = toPrecision(average(samples), 3),
            max = getMax(samples),
            min = getMin(samples),
            stddev = toPrecision(getStandardDeviation(samples), 5); 

        return {
            'test': test,
            'samples': samples.reduce(function (carry, sample) { carry.push(Math.round(sample * 10000) / 10000); return carry; }, []),
            'avg': avg,
            'max': max,
            'min': min,
            'stddev': stddev
        };
    });
};
Share.prototype.isValid = function () {
    return (this.time && this.userPlatform && this.samples);
};
Share.prototype.save = function () {
    return when.promise(function (resolve, reject) {
        if (!this.isValid()) return reject('Bad data received');

        fs.mkdir(savePath, function (err) {
            var payload;

            if (err && err.code !== 'EEXIST') return reject('Could not create save path');

            payload = JSON.stringify({ userPlatform: this.userPlatform, device: this.device, screen: this.screen, samples: this.samples });
            fs.writeFile([savePath, this.time, '.txt'].join(''), payload, function (err) {
                if (err) return reject(err.message);
                resolve('OKAY');
            });
        }.bind(this));
    }.bind(this));
};
Share.prepare = function (data) {
    return new Share(data);
};

module.exports = Share;