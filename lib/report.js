var Sample = require('./sample'),
    parser = require('ua-parser-js');

var Report = function (reportData) {
    var device = typeof reportData.device == 'object' ? reportData.device : {};

    this.userPlatform = typeof reportData.userPlatform == 'string' ? reportData.userPlatform : 'Undisclosed';
    this.agent = typeof device.agent == 'string' ? device.agent : 'Undisclosed';
    this.description = this.buildDescription(device, this.agent);

    this.findScreenInfo(reportData);

    this.processStats(reportData.samples);

};
Report.USER_MAKER = 0;
Report.USER_MODEL = 1;
Report.OS_NAME = 2;
Report.OS_VERSION = 3;
Report.BROWSER_NAME = 4;
Report.BROWSER_VERSION_MAJOR = 5;
Report.DEVICE_VENDOR = 6;
Report.DEVICE_MODEL = 7;

Report.prototype.findScreenInfo = function (reportData) {
    if (typeof reportData.screen == 'object' && reportData.screen.constructor === Array && reportData.screen.length === 4) {
        this.screenBase = reportData.screen.slice(0, 2);
        this.screenAdjusted = reportData.screen.slice(2, 4);
    } else {
        this.screenBase = [0, 0];
        this.screenAdjusted = [0, 0];
    }

    this.hardwarePixels = this.screenAdjusted[0] * this.screenAdjusted[1];
};
Report.prototype.buildDescription = function (device, agentString) {
    var ua = parser(agentString);

    return [
        typeof device.maker == 'string' ? device.maker : 'Undisclosed',
        typeof device.model == 'string' ? device.model : 'Undisclosed',
        ua.os.name,
        ua.os.version,
        ua.browser.name,
        ua.browser.major,
        ua.device.vendor,
        ua.device.model
    ];
};
Report.prototype.processStats = function (stats) {
    var handicap;
    stats = stats.map(function (dataset) { return new Sample(dataset); });
    
    handicap = stats.map(function (stat) { return stat.score; })
        .map(function (score) { return (1000 - score) / 1000; })
        .map(function (handicap) { return Math.pow(handicap, 1 / 3); })
        .reduce(function (sum, handicap) { return sum + handicap; }, 0) / stats.length;
    this.rating = Math.round(100 * (1 - handicap));    

    this.testResults = stats.reduce(function (carry, statSet) { carry[statSet.testName] = statSet; return carry; }, {});
};
Report.prototype.isValid = function () {
    return true;
};


module.exports = Report;