var sum = function (values) { return values.reduce(function (sum, value) { return sum + value; }, 0); };
var avg = function (values, precision) {
    precision = typeof precision == 'number' ? precision : 10; 

    return Math.round(Math.pow(10, precision) * sum(values) / values.length) / Math.pow(10, precision);
};
var stddev = function (values) {
    var squareDiffs = function (values, avg) { return values.map(function (val) { var diff = val - avg; return diff * diff; }); };

    var average = avg(values),
        sqd = squareDiffs(values, average),
        avgSquareDiff = avg(sqd);

    return Math.round(Math.sqrt(avgSquareDiff) * 1000) / 1000;
};

var histogram = function (values, lowerLimit, upperLimit) {
    return values.filter(function (value) { return value > lowerLimit && value <= upperLimit; }).length;
};
var scorer = function (k) {
    if ((k *= 2) < 1) return 0.5 * k * k * k * k;
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
};

var Sample = function (dataset) {
    var samples = dataset.samples.sort(),
        adjustedSamples = samples.slice(2, samples.length - 2),
        totalSamples = samples.length,
        baseScore;

    this.testName = dataset.test;

    this.max = samples.reduce(function (max, sample) { if (sample > max) return sample; return max; }, Number.NEGATIVE_INFINITY);
    this.min = samples.reduce(function (min, sample) { if (sample < min) return sample; return min; }, Number.POSITIVE_INFINITY);
    this.avg = avg(adjustedSamples, 3);
    this.stddev = stddev(samples);

    this.deciles = [
        histogram(samples, Number.NEGATIVE_INFINITY, 5, totalSamples),
        histogram(samples, 5, 10, totalSamples),
        histogram(samples, 10, 15, totalSamples),
        histogram(samples, 15, 20, totalSamples),
        histogram(samples, 20, 25, totalSamples),
        histogram(samples, 25, 30, totalSamples),
        histogram(samples, 30, 35, totalSamples),
        histogram(samples, 35, 40, totalSamples),
        histogram(samples, 40, 45, totalSamples),
        histogram(samples, 45, 50, totalSamples),
        histogram(samples, 50, 55, totalSamples),
        histogram(samples, 55, Number.POSITIVE_INFINITY, totalSamples)
    ];

    // this.score = Math.round(this.deciles.reduce(function (score, slice, index) { return score + (Math.pow(2, index) * slice); }, 0)  / 20.48);
    baseScore = this.deciles.reduce(function (score, decile, index, arr) {
        return score + (decile * scorer((index + 1)  / arr.length));
    }, 0) / totalSamples;
    this.score = Math.round(baseScore * 1000);
};

module.exports = Sample;