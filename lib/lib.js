"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var agora_criteria_1 = __importStar(require("agora-criteria"));
var lodash_1 = __importDefault(require("lodash"));
var fs_1 = require("fs");
var stream_1 = require("stream");
var csv_stringify_1 = __importDefault(require("csv-stringify"));
var agora_graph_1 = require("agora-graph");
agora_criteria_1.default.add(agora_criteria_1.OrthogonalOrdering.Default, agora_criteria_1.OrthogonalOrdering.KendallTauDistance, agora_criteria_1.OrthogonalOrdering.NumberInversions, agora_criteria_1.OrthogonalOrdering.NormalizedNumberInversions, agora_criteria_1.Spread.BoundingBox.Area, agora_criteria_1.Spread.BoundingBox.NormalizedArea, agora_criteria_1.Spread.BoundingBox.L1MetricLength, agora_criteria_1.Spread.ConvexHull.Area, agora_criteria_1.GlobalShape.BoundingBox.AspectRatio, agora_criteria_1.GlobalShape.BoundingBox.AspectRatioPlus, agora_criteria_1.GlobalShape.ConvexHull.StandardDeviation, agora_criteria_1.NodeMovement.DistanceMoved.Hamiltonian, agora_criteria_1.NodeMovement.DistanceMoved.MeanEuclidean, agora_criteria_1.NodeMovement.DistanceMoved.NormalizedEuclidean, agora_criteria_1.NodeMovement.DistanceMoved.SquaredEuclidean, agora_criteria_1.NodeMovement.DistanceMoved.ImprovedMeanSquaredEuclidean, 
// NodeMovement.KNearestNeighbors.default,
agora_criteria_1.NodeMovement.KNearestNeighbors.setK(8), agora_criteria_1.NodeMovement.KNearestNeighbors.setK(9), agora_criteria_1.NodeMovement.KNearestNeighbors.setK(10), agora_criteria_1.NodeMovement.KNearestNeighbors.setK(11), agora_criteria_1.NodeMovement.KNearestNeighbors.setK(12), agora_criteria_1.NodeMovement.MovedNodes, agora_criteria_1.EdgeBased.Ratio, agora_criteria_1.EdgeBased.RelativeStandardDeviation, agora_criteria_1.EdgeBased.RelativeStandardDeviationDelaunay);
exports.CRITERIAS_NAMES = lodash_1.default.map(agora_criteria_1.default.criterias, function (crit) { return crit.short; }).sort();
function evaluate(criteriasShort, informations, folder) {
    if (lodash_1.default.difference(criteriasShort, exports.CRITERIAS_NAMES).length !== 0) {
        console.log('given:', criteriasShort, 'available algorithms :', exports.CRITERIAS_NAMES, 'not matching :', lodash_1.default.difference(criteriasShort, exports.CRITERIAS_NAMES));
        return;
    }
    var criterias = lodash_1.default.filter(agora_criteria_1.default.criterias, function (c) { return c.short !== undefined && criteriasShort.includes(c.short); });
    var resultFile = folder + new Date().getTime() + '.csv';
    var columns = [
        'type',
        'n',
        'm',
        'iteration',
        'algorithm'
    ].concat(lodash_1.default.map(criterias, 'name'));
    var stringifier = csv_stringify_1.default({
        delimiter: ';',
        header: true,
        columns: columns
    });
    var writeStream = fs_1.createWriteStream(resultFile);
    stream_1.pipeline(stringifier, writeStream, function (err) {
        if (err)
            console.error('error writing the results', err);
    });
    lodash_1.default.forEach(informations, function (_a) {
        var type = _a.type, nodes = _a.nodes, iteration = _a.iteration, algorithm = _a.algorithm, initial = _a.initial, final = _a.final;
        try {
            var initialGraph_1 = agora_graph_1.crop(JSON.parse(fs_1.readFileSync(initial, 'utf8')));
            initialGraph_1.nodes.sort(function (a, b) { return a.index - b.index; });
            var updatedGraph_1 = agora_graph_1.crop(JSON.parse(fs_1.readFileSync(final, 'utf8')));
            updatedGraph_1.nodes.sort(function (a, b) { return a.index - b.index; });
            console.log(initial, algorithm);
            var csvRow_1 = {
                type: type,
                n: nodes,
                m: initialGraph_1.edges.length,
                iteration: iteration,
                algorithm: algorithm
            };
            lodash_1.default.forEach(criterias, function (c) {
                var initialPayload = {
                    nodes: lodash_1.default.map(initialGraph_1.nodes, function (n) { return (__assign({}, n)); }),
                    edges: lodash_1.default.map(initialGraph_1.edges, function (e) { return (__assign({}, e)); })
                };
                var updatedPayload = {
                    nodes: lodash_1.default.map(updatedGraph_1.nodes, function (n) { return (__assign({}, n)); }),
                    edges: lodash_1.default.map(updatedGraph_1.edges, function (e) { return (__assign({}, e)); })
                };
                var result = c.criteria(initialPayload, updatedPayload);
                csvRow_1[c.name] = result.value;
            });
            // console.log(csvRow);
            stringifier.write(csvRow_1);
        }
        catch (error) {
            console.error('error with', final, ':', error);
        }
    });
    stringifier.end();
}
exports.evaluate = evaluate;
