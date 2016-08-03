export class Report {
    constructor(data) {
        this.pixelCount = data.hardwarePixels;
        this.rating = data.rating;
        this.userPlatform = data.userPlatform;
        this.userAgent = data.agent;

        this.userMaker = data.description[0] || 'undisclosed';
        this.userModel = data.description[1] || 'undisclosed';
        this.osName = data.description[2] || 'unknown';
        this.osVersion = data.description[3] || 'unknown';
        this.browserName = data.description[4] || 'unknown';
        this.browserVersion = data.description[5] || 'unknown';
        this.vendorName = data.description[6] || 'unknown';
        this.vendorModel = data.description[7] || 'unknown';

        this.testResults = data.testResults;

        this.histograms = Object.keys(this.testResults).reduce((carry, type) => { carry[type] = this.shapeHistogram(this.testResults[type]); return carry; }, {});
    }
    shapeHistogram(samples) {
        var sum = samples.deciles.reduce((sum, value) => sum + value, 0);

        return samples.deciles.map(count => Math.round(100 * count / sum));
    }
}
Report.filter = function (reports, filter) {
    return reports.filter(report => {
        return (filter.selectedMake === '' || report.userMaker === filter.selectedMake)
            && (filter.selectedModel === '' || report.userModel === filter.selectedModel)
            && (filter.selectedOSName === '' || report.osName === filter.selectedOSName)
            && (filter.selectedOSVersion === '' || report.osVersion === filter.selectedOSVersion)
            && (filter.selectedBrowserName === '' || report.browserName === filter.selectedBrowserName)
            && (filter.selectedBrowserVersion === '' || report.browserVersion === filter.selectedBrowserVersion)
            && (filter.selectedDeviceVendor === '' || report.vendorName === filter.selectedDeviceVendor)
            && (filter.selectedDeviceVendorModel === '' || report.vendorModel === filter.selectedDeviceVendorModel);
    });
};