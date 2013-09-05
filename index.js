#!/usr/bin/env node

//Modules
var argv = require('optimist').argv;

//Variables
var fromLocale = 'en_US',
    mode = argv._[0],
    toLocale = argv._[1],
    fileName = argv._[2];

//Console verbosity
console.verbose = function() {
    if (!argv.v) {
        return;
    }
    console.log.apply(console, arguments);
};

//Colors
var red = '\x1b[31m',
    reset = '\x1b[0m';

//Validate mode
if (mode != 'import' && mode != 'export') {
    showUsage();
    console.log(red + 'Mode must be either `import` or `export`.' + reset);
    process.exit(1);
}

//Check fileName
if (!fileName) {
    showUsage();
    console.log(red + 'Missing ' + mode + ' CSV filename.' + reset);
    process.exit(1);
}

//Import proper module
var mode_modular = require('./lib/locale_' + mode);
mode_modular.handle(fromLocale, toLocale, fileName);

function showUsage() {
    console.log(
        'Import/export Billy\'s Billing translation files\n' +
        '\n' +
        'Usage:\n' +
        '    ' + argv.$0 + ' export locale output_file.csv\n' +
        '    ' + argv.$0 + ' import locale input_file.csv\n' +
        ''
    );
}