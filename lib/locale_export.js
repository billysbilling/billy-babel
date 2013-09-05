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
            csvOutput = [];

        csvOutput.push({
            key: 'Translation key (DO NOT CHANGE)',
            english_string: 'From ' + fromLocale + ' (DO NOT CHANGE)',
            translated_string: 'To ' + toLocale
        });
        for (var key in fromLocaleStrings) {
            var currentString = fromLocaleStrings[key];
            if (!toLocaleOptions[key] || toLocaleOptions[key]['original'] !== currentString) {
                console.verbose('Exporting `' + key + '`');
                csvOutput.push({
                    key: key,
                    english_string: currentString,
                    translated_string: ""
                });
            }
        }

        //If no keys, we're done
        if (Object.keys(csvOutput).length <= 1) {
            console.log('There are no keys to be translated.');
            process.exit(0);
        }

        //Write CSV file
        csv()
            .from(csvOutput)
            .to(exportFile)
            .on('end', function(count){
                console.log(green + 'Wrote ' + (count - 1) + ' lines to ' + exportFile + '.' + reset);
            })
            .on('error', function(error){
                console.log(red + error.message + reset);
            });
    }
};
