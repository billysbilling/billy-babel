var fs = require('fs');

module.exports = {
    handle: function(fromLocale, toLocale) {
        var fromLocaleFilename = './' + fromLocale + '.json',
            toLocaleFilename = './' + toLocale + '.json',
            toLocaleOptionsFilename = './' + toLocale + '-options.json',
            fromLocaleStrings = parseFromFile(fromLocaleFilename),
            toLocaleStrings = parseToFile(toLocaleFilename),
            toLocaleOptions = parseToOptionsFile(toLocaleOptionsFilename);

        for (var key in fromLocaleStrings) {
            console.log('Checking ' + key);
        }
    }
};

function parseFromFile(filename) {
    if (!fs.existsSync(filename)) {
        throw Error('Source locale file `' + filename + '` doesn\'t exist.');
    }
    try {
        return JSON.parse(fs.readFileSync(filename));
    } catch (err) {
        throw Error('Source locale file `' + filename + '` could not be parsed.');
    }
}
function parseToFile(filename) {
    if (fs.existsSync(filename)) {
        try {
            return JSON.parse(fs.readFileSync(filename));
        } catch (err) {
            throw Error('Destination locale file `' + filename + '` exists, but could not be parsed.');
        }
    }
    return {};
}
function parseToOptionsFile(filename) {
    if (fs.existsSync(filename)) {
        try {
            return JSON.parse(fs.readFileSync(filename));
        } catch (err) {
            throw Error('Destination locale options file `' + filename + '` exists, but could not be parsed.');
        }
    }
    return {};
}