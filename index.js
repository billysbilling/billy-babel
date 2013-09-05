#!/usr/bin/env node

//Modules
var argv = require('optimist').argv;

//Variables
var mode = argv._[0],
    fromLocale = 'en_US',
    toLocale = argv._[1];

//Colors
var red = '\x1b[31m',
    blue = '\x1b[34m',
    reset = '\x1b[0m';


function showUsage() {
    console.log('Import/export Billy\'s Billing translation files\nUsage: ' + argv.$0 + ' [import|export] locale\n');
}

//Validate mode
if (mode != 'import' && mode != 'export') {
    showUsage();
    console.log(red + 'Mode must be either `import` or `export`.' + reset);
    process.exit(1);
}

//Import proper module
var mode_modular = require('./lib/locale_' + mode);
mode_modular.handle(fromLocale, toLocale);