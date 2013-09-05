var fs = require('fs'),
    common = require('./common'),
    csv = require('csv');

//Colors
var green = '\x1b[32m',
    red = '\x1b[31m',
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
                console.verbose('Exporting `' + key + '`');
                results.push({
                    key: key,
                    english_string: currentString,
                    translated_string: ""
                });
            }
        }

        //Write CSV file
        csv()
            .from(results)
            .to(exportFile)
            .on('end', function(count){
                console.log(green + 'Wrote ' + count + ' lines to ' + exportFile + '.' + reset);
            })
            .on('error', function(error){
                console.log(red + error.message + reset);
            });
    }
};
