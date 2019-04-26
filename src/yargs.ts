import { readdirSync, existsSync } from 'fs';
import { extname, basename } from 'path';
import { CRITERIAS_NAMES, Information, evaluate } from './lib';
import _ from 'lodash';
import { Argv } from 'yargs';

const ORIGIN_FOLDER = './data/json/';
const FINAL_FOLDER = './data/final/';

const JSON_EXT = '.json';
const GML_EXT = '.gml';
const EXTENSION = [JSON_EXT, GML_EXT];

const defaultOriginFiles = () =>
  existsSync(ORIGIN_FOLDER)
    ? _.filter(
        _.map(readdirSync(ORIGIN_FOLDER), file => ORIGIN_FOLDER + file),
        file => {
          const ext = extname(file);
          const fileName = basename(file, ext);

          // fait parti des extensions et n'est pas final
          return EXTENSION.includes(ext) && extname(fileName) !== '.final';
        }
      )
    : [];

const defaultFinalFiles = () =>
  existsSync(FINAL_FOLDER)
    ? _.filter(
        _.map(readdirSync(FINAL_FOLDER), file => FINAL_FOLDER + file),
        file => {
          const ext = extname(file);
          const fileName = basename(file, ext);

          // fait parti des extensions et est final
          return EXTENSION.includes(ext) && extname(fileName) === '.final';
        }
      )
    : [];

export const command = 'evaluate [criterias..]';
export const describe = 'evaluate the files with the algorithms';

export const builder = (yargs: Argv) =>
  yargs
    .positional('criterias', {
      describe: 'list of criterias to evaluate with',
      default: CRITERIAS_NAMES
    })
    .array('initials')
    .alias('initials', 'i')
    .default('initials', defaultOriginFiles())
    .describe(
      'initials',
      'initial graphs, retrieved from ./data/json/ by default'
    )
    .array('finals')
    .alias('finals', 'f')
    .default('finals', defaultFinalFiles())
    .describe('finals', 'final graphs, retrieved from ./data/final/ by default')
    .alias('output', 'r')
    .default('output', './data/')
    .describe('output', 'folder where the result files are saved');

export const handler = ({
  criterias,
  finals,
  initials,
  output: folder
}: {
  criterias: string[];
  initials: string[];
  finals: string[];
  output: string;
}) => {
  criterias.sort();

  const mappedFinal = _.keyBy(finals, str => basename(str, '.final.json'));
  const mappedInitial = _.keyBy(initials, str => basename(str, '.json'));

  const pair: {
    [k: string]: Information;
  } = {};

  for (const key in mappedFinal) {
    const slicedkey = key.slice(0, key.lastIndexOf('_'));
    if (mappedInitial[slicedkey] === undefined) continue;

    const information = key.split('_');
    pair[key] = {
      type: information[0],
      nodes: information[1],
      iteration: information[2],
      algorithm: information[3],
      initial: mappedInitial[slicedkey],
      final: mappedFinal[key]
    };
  }

  if (_.keys(pair).length === 0)
    return console.log('No matching graphs have been found, aborting');
  evaluate(criterias, pair, folder);
};
