import yargs = require('yargs');

yargs
  .command(
    '$0 [criterias..]',
    'evaluate the files with the algorithms',
    require('./yargs')
  )
  .help().argv;
