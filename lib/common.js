var fs = require('fs');

//Colors
var red = '\x1b[31m',
    reset = '\x1b[0m';

module.exports = {
    parseFile: function (filename, required) {
        if (required && !fs.existsSync(filename)) {
            throw Error(red + 'Required file `' + filename + '` doesn\'t exist.' + reset);
        }
        if (fs.existsSync(filename)) {
            try {
                return JSON.parse(fs.readFileSync(filename));
            } catch (err) {
                throw Error(red + 'File `' + filename + '` exists, but could not be parsed.' + reset);
            }
        }
        return {};
    }
};