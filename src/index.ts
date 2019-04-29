import yargs = require('yargs');

yargs
  .completion()
  .command(
    '$0 [criterias..]',
    'evaluate the files with the algorithms',
    require('./yargs')
  )
  .help().argv;
