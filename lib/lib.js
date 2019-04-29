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
agora_criteria_1.default.add(agora_criteria_1.OrthogonalOrdering.Default, agora_criteria_1.OrthogonalOrdering.KendallTau, agora_criteria_1.OrthogonalOrdering.NumberInversions, agora_criteria_1.OrthogonalOrdering.NumberInversionsMean, agora_criteria_1.Spread.BoundingBox.Area, agora_criteria_1.Spread.BoundingBox.AreaNormalized, agora_criteria_1.Spread.BoundingBox.L1MetricLength, agora_criteria_1.Spread.ConvexHull.Area, agora_criteria_1.GlobalShape.BoundingBox.AspectRatio, agora_criteria_1.GlobalShape.BoundingBox.AspectRatioPlus, agora_criteria_1.GlobalShape.ConvexHull.StandardShapePreservation, agora_criteria_1.NodeMouvement.DistanceMoved.Hamiltonian, agora_criteria_1.NodeMouvement.DistanceMoved.MeanEuclidian, agora_criteria_1.NodeMouvement.DistanceMoved.Normalized, agora_criteria_1.NodeMouvement.DistanceMoved.Squared, agora_criteria_1.NodeMouvement.DistanceMoved.Custom, 
// NodeMouvement.KNearestNeighbors.default,
agora_criteria_1.NodeMouvement.KNearestNeighbors.setK(8), agora_criteria_1.NodeMouvement.KNearestNeighbors.setK(9), agora_criteria_1.NodeMouvement.KNearestNeighbors.setK(10), agora_criteria_1.NodeMouvement.KNearestNeighbors.setK(11), agora_criteria_1.NodeMouvement.KNearestNeighbors.setK(12), agora_criteria_1.NodeMouvement.MovedNodes, agora_criteria_1.EdgeLength.Ratio, agora_criteria_1.EdgeLength.RelativeStandardDeviation, agora_criteria_1.EdgeLength.RelativeStandardDeviationDelaunay);
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
            var initialGraph_1 = JSON.parse(fs_1.readFileSync(initial, 'utf8'));
            var updatedGraph_1 = JSON.parse(fs_1.readFileSync(final, 'utf8'));
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
