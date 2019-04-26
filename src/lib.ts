import CriteriaManager, {
  OrthogonalOrdering,
  Spread,
  GlobalShape,
  NodeMouvement,
  EdgeLength
} from 'agora-criteria';

import _ from 'lodash';
import { createWriteStream, readFileSync } from 'fs';
import { pipeline } from 'stream';
import stringify from 'csv-stringify';

export interface Information {
  type: string;
  nodes: string;
  iteration: string;
  initial: string;
  final: string;
  algorithm: string;
}

CriteriaManager.add(
  OrthogonalOrdering.Custom,
  OrthogonalOrdering.Default,
  OrthogonalOrdering.KendallTau,
  OrthogonalOrdering.NumberInversions,

  Spread.BoundingBox.Area,
  Spread.BoundingBox.AreaNormalized,
  Spread.BoundingBox.L1MetricLength,
  Spread.ConvexHull.Area,

  GlobalShape.BoundingBox.AspectRatio,
  GlobalShape.BoundingBox.AspectRatioPlus,
  GlobalShape.ConvexHull.StandardShapePreservation,

  NodeMouvement.DistanceMoved.Hamiltonian,
  NodeMouvement.DistanceMoved.MeanEuclidian,
  NodeMouvement.DistanceMoved.Normalized,
  NodeMouvement.DistanceMoved.Squared,
  // NodeMouvement.KNearestNeighbors.default,
  NodeMouvement.KNearestNeighbors.setK(8),
  NodeMouvement.KNearestNeighbors.setK(9),
  NodeMouvement.KNearestNeighbors.setK(10),
  NodeMouvement.KNearestNeighbors.setK(11),
  NodeMouvement.KNearestNeighbors.setK(12),
  NodeMouvement.MovedNodes,

  EdgeLength.Ratio,
  EdgeLength.RelativeStandardDeviation
);

export const CRITERIAS_NAMES = _.map<any, string>(
  CriteriaManager.criterias,
  crit => crit.short
).sort();

export function evaluate(
  criteriasShort: string[],
  informations: { [k: string]: Information },
  folder: string
) {
  if (_.difference(criteriasShort, CRITERIAS_NAMES).length !== 0) {
    console.log(
      'given:',
      criteriasShort,
      'available algorithms :',
      CRITERIAS_NAMES,
      'not matching :',
      _.difference(criteriasShort, CRITERIAS_NAMES)
    );
    return;
  }

  const criterias = _.filter(
    CriteriaManager.criterias,
    c => c.short !== undefined && criteriasShort.includes(c.short)
  );

  const resultFile = folder + new Date().getTime() + '.csv';

  const columns: string[] = [
    'type',
    'n',
    'm',
    'iteration',
    'algorithm',
    ..._.map(criterias, 'name')
  ];
  const stringifier = stringify({
    delimiter: ';',
    header: true,
    columns
  });
  const writeStream = createWriteStream(resultFile);
  pipeline(stringifier, writeStream, err => {
    if (err) console.error('error writing the results', err);
  });

  _.forEach(
    informations,
    ({ type, nodes, iteration, algorithm, initial, final }) => {
      try {
        const initialGraph = JSON.parse(readFileSync(initial, 'utf8'));
        const updatedGraph = JSON.parse(readFileSync(final, 'utf8'));

        console.log(initial, algorithm);

        const csvRow: { [k: string]: any } = {
          type,
          n: nodes,
          m: initialGraph.edges.length,
          iteration: iteration,
          algorithm
        };

        _.forEach(criterias, c => {
          const initialPayload = {
            nodes: _.map(initialGraph.nodes, n => ({ ...n })),
            edges: _.map(initialGraph.edges, e => ({ ...e }))
          };
          const updatedPayload = {
            nodes: _.map(updatedGraph.nodes, n => ({ ...n })),
            edges: _.map(updatedGraph.edges, e => ({ ...e }))
          };
          const result = c.criteria(initialPayload, updatedPayload);
          csvRow[c.name] = result.value;
        });

        // console.log(csvRow);
        stringifier.write(csvRow);
      } catch (error) {
        console.error('error with', final, ':', error);
      }
    }
  );
  stringifier.end();
}
