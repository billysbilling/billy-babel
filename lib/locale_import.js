var fs = require('fs'),
    common = require('./common'),
    csv = require('csv');

//Colors
var red = '\x1b[31m',
    green = '\x1b[32m',
    yellow = '\x1b[33m',
    reset = '\x1b[0m';

module.exports = {
    handle: function(fromLocale, toLocale, importFile) {
        var fromLocaleFilename = fromLocale + '.json',
            toLocaleFilename = toLocale + '.json',
            toLocaleOptionsFilename = toLocale + '-options.json',
            fromLocaleStrings = common.parseFile(fromLocaleFilename, true),
            toLocaleStrings = common.parseFile(toLocaleFilename),
            toLocaleOptions = common.parseFile(toLocaleOptionsFilename);

        //Read CSV file
        var importStrings = {};
        csv()
            .from(importFile)
            .to.array(function(data) {
                validateCsvHeader(data[0], fromLocale, toLocale);
                for (var i = 1; i < data.length; i++) {
                    var row = data[i];
                    importStrings[row[0]] = {
                        from_string: row[1],
                        to_string: row[2]
                    };
                }
            })
            .on('end', function(count){
                var updatedStrings = updateStrings(importStrings, fromLocaleStrings, toLocaleStrings, toLocaleOptions);
                fs.writeFileSync(toLocaleFilename, JSON.stringify(toLocaleStrings, null, '    '), null, function(err) {
                    console.log(red + 'Error saving `' + toLocaleFilename + '`: ' + err.message + reset);
                    process.exit(1);
                });
                fs.writeFileSync(toLocaleOptionsFilename, JSON.stringify(toLocaleOptions, null, '    '), null, function(err) {
                    console.log(red + 'Error saving `' + toLocaleFilename + '`: ' + err.message + reset);
                    process.exit(1);
                });
                console.log(green + 'Parsed ' + (count - 1) + ' strings, updated ' + updatedStrings + '.' + reset);
            })
            .on('error', function(err){
                console.log(red + 'Error importing CSV file: ' + err.message + reset);
                process.exit(1);
            });
    }
};

function validateCsvHeader(header, fromLocale, toLocale) {
    if (header[0] != 'Translation key (DO NOT CHANGE)') {
        console.log(red + 'Invalid header, please check file and resubmit.' + reset);
        process.exit(1);
    } else if (header[1] != 'From ' + fromLocale + ' (DO NOT CHANGE)') {
        console.log(red + 'Invalid header or source locale, please check file and resubmit.' + reset);
        process.exit(1);
    } else if (header[2] != 'To ' + toLocale) {
        console.log(red + 'Invalid header or destination locale, please check file and resubmit.' + reset);
        process.exit(1);
    }
}

function updateStrings(importStrings, fromLocaleStrings, toLocaleStrings, toLocaleOptions) {
    var changed = 0;
    for (var key in importStrings) {
        if (!importStrings.hasOwnProperty(key)) {
            continue;
        }

        var fromString  = importStrings[key]['from_string'],
            toString    = importStrings[key]['to_string'];

        //Skip if...
        if (!toString) {
            //Translation was not provided
            console.log(yellow + 'Translation for `' + key + '` was not provided, skipping...' + reset);
            continue;
        } else if (!fromString) {
            //Translation was not provided
            console.log(yellow + 'Original string for `' + key + '` was not provided, skipping...' + reset);
            continue;
        } else if (!fromLocaleStrings[key]) {
            //Key does not exist in primary locale
            console.log(yellow + 'Translation key `' + key + '` does not exist in primary locale, skipping...' + reset);
            continue;
        }
        changed++;

        //Update both objects
        toLocaleStrings[key] = toString;
        toLocaleOptions[key] = toLocaleOptions[key] || {};
        toLocaleOptions[key]['original'] = fromString;
    }
    return changed;
}