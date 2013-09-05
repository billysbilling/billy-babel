var fs = require('fs'),
    common = require('./common'),
    csv = require('csv');

//Colors
var green = '\x1b[32m',
    red = '\x1b[31m',
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
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    importStrings[row[0]] = {
                        from_string: row[1],
                        to_string: row[2]
                    };
                }
            })
            .on('end', function(count){
                process.stdout.write('Parsed ' + count + ' entries.  Importing...');
                updateStrings(importStrings, fromLocaleStrings, toLocaleStrings, toLocaleOptions);
                console.log('Done.');

                fs.writeFileSync(toLocaleFilename, JSON.stringify(toLocaleStrings, null, '    '));
                fs.writeFileSync(toLocaleOptionsFilename, JSON.stringify(toLocaleOptions, null, '    '));
            })
            .on('error', function(error){
                console.log(red + error.message + reset);
                process.exit(1);
            });
    }
};


function updateStrings(importStrings, fromLocaleStrings, toLocaleStrings, toLocaleOptions) {
    for (var key in importStrings) {
        if (!importStrings.hasOwnProperty(key)) {
            continue;
        }

        var fromString  = importStrings[key]['from_string'],
            toString    = importStrings[key]['to_string'];

        //Skip if...
        if (!toString) {
            //Translation was not provided
            continue;
        } else if (!fromLocaleStrings[key]) {
            //Key does not exist in primary locale
            continue;
        } else if (toLocaleOptions[key] && toLocaleOptions[key]['original'] == fromString) {
            //String exists in options file and original string matches
            continue;
        }

        //Update both objects
        toLocaleStrings[key] = toString;
        toLocaleOptions[key] = toLocaleOptions[key] || {};
        toLocaleOptions[key]['original'] = fromString;
    }
}