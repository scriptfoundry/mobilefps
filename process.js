var fs = require('fs'),
    path = require('path'),
    when = require('when'),
    nodefn = require('when/node'),
    readdir = nodefn.lift(fs.readdir),
    readFile = nodefn.lift(fs.readFile),
    mkdir = nodefn.lift(fs.mkdir),
    writeFile = nodefn.lift(fs.writeFile),
    Report = require('./lib/report'),
    reportsPath = path.join(process.env.OPENSHIFT_DATA_DIR || '/tmp/', 'samples/'),
    publicDataPath = path.join(process.env.OPENSHIFT_DATA_DIR || '/tmp/', 'summaries/');

var getFileList = function () {
    var rxValidFilename = /\d+\.\d+\.txt/;

    return readdir(reportsPath)
    .then(function (files) {
        return files.filter(function(filename) { return rxValidFilename.test(filename); }).map(function (filename) { return path.join(reportsPath, filename); });
    });
};

var loadReportFile = function (path) {
    return readFile(path)
    .then(function (data) { return JSON.parse(data); })
};

var loadAllReports = function (files) {
    return when.reduce(files, function (carry, path) {
        return loadReportFile(path)
        .then(function (reportFileContents) {
            var report = new Report(reportFileContents);
            if (report.isValid()) carry.push(report);
            return carry;
        });
    }, []);
};

var getBestUniqueNames = function (names) {
    var uniqueNames = names.reduce(function (carry, name) {
        var trimedLowercaseName = name.trim().toLowerCase(),
            matchingNames = carry.filter(function (addedName) { return addedName.toLowerCase() === trimedLowercaseName; }),
            otherNames = carry.filter(function (addedName) { return addedName.toLowerCase() !== trimedLowercaseName; }),
            bestName = matchingNames.reduce(function (currentBest, matchingName) { return currentBest < matchingName ? currentBest : matchingName; }, name.trim());
        
        if (matchingNames.length === 0) carry.push(bestName);
        else carry = otherNames.concat(bestName);

        return carry;
    }, []);

    return uniqueNames.sort();
};

var normalizeData = function (summary) {
    var bestMakers = getBestUniqueNames(summary.map(function (report) { return report.maker; })),
        bestModels = getBestUniqueNames(summary.map(function (report) { return report.model; })),
        modelsByMaker = {};

    summary.sort(function (a, b) { return a.maker > b.maker ? 1 : -1; });

    summary.forEach(function (report) {
        var currentMaker = report.maker,
            currentModel = report.model,
            bestMaker = bestMakers.reduce(function (current, best) { if (best.toLowerCase() === currentMaker.trim().toLowerCase()) return best; return current; }, currentMaker),
            bestModel = bestModels.reduce(function (current, best) { if (best.toLowerCase() === currentModel.trim().toLowerCase()) return best; return current; }, currentModel);

        report.maker = bestMaker;
        report.model = bestModel;

        if (typeof modelsByMaker[report.maker] == 'undefined') modelsByMaker[report.maker] = [report.model];
        else if (!modelsByMaker[report.maker].some(function(model) { return model === report.model; })) modelsByMaker[report.maker].push(report.model);

        modelsByMaker[report.maker].sort();
    });

    summary.sort(function (a, b) { return a.rating > b.rating ? 1 : -1; });

    return [modelsByMaker, summary];
};

var saveResults = function (payload) {
    var modelsByMaker = payload[0],
        summary = payload[1];

    return mkdir(publicDataPath)
    .catch(function (err) { if (err.code !== 'EEXIST') throw err; })
    .then(function () { return writeFile(path.join(publicDataPath, 'devices.json'), JSON.stringify(modelsByMaker)); })
    .then(function() { return writeFile(path.join(publicDataPath, 'summary.json'), JSON.stringify(summary)); });
};

getFileList()
.then(loadAllReports)
.then(normalizeData)
.then(saveResults)
.catch(function (err) { console.error(err.message, err.stack); })
.then(function () { console.log("DONE"); });
