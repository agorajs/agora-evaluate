"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
yargs
    .command('$0 [criterias..]', 'evaluate the files with the algorithms', require('./yargs'))
    .help().argv;
