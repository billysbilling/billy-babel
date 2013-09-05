var fs = require('fs'),
    common = require('./common'),
    csv = require('to-csv');

//Colors
var green = '\x1b[32m',
    reset = '\x1b[0m';

module.exports = {
    handle: function(fromLocale, toLocale, exportFile) {
        var fromLocaleFilename = fromLocale + '.json',
            toLocaleOptionsFilename = toLocale + '-options.json',
            fromLocaleStrings = common.parseFile(fromLocaleFilename, true),
            toLocaleOptions = common.parseFile(toLocaleOptionsFilename),
            results = [];

        for (var key in fromLocaleStrings) {
            var currentString = fromLocaleStrings[key];
            if (!toLocaleOptions[key] || toLocaleOptions[key]['original'] !== currentString) {
                results.push({
                    key: key,
                    english_string: currentString,
                    translated_string: ""
                });
            }
        }

        //Write CSV file
        fs.writeFileSync(exportFile, csv(results));
        console.log(green + 'File `' + exportFile + '` exported successfully.' + reset);
    }
};
