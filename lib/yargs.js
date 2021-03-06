"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var lib_1 = require("./lib");
var lodash_1 = __importDefault(require("lodash"));
var ORIGIN_FOLDER = './data/json/';
var FINAL_FOLDER = './data/final/';
var JSON_EXT = '.json';
var GML_EXT = '.gml';
var EXTENSION = [JSON_EXT, GML_EXT];
var defaultOriginFiles = function () {
    return (0, fs_1.existsSync)(ORIGIN_FOLDER)
        ? lodash_1.default.filter(lodash_1.default.map((0, fs_1.readdirSync)(ORIGIN_FOLDER), function (file) { return ORIGIN_FOLDER + file; }), function (file) {
            var ext = (0, path_1.extname)(file);
            var fileName = (0, path_1.basename)(file, ext);
            // fait parti des extensions et n'est pas final
            return EXTENSION.includes(ext) && (0, path_1.extname)(fileName) !== '.final';
        })
        : [];
};
var defaultFinalFiles = function () {
    return (0, fs_1.existsSync)(FINAL_FOLDER)
        ? lodash_1.default.filter(lodash_1.default.map((0, fs_1.readdirSync)(FINAL_FOLDER), function (file) { return FINAL_FOLDER + file; }), function (file) {
            var ext = (0, path_1.extname)(file);
            var fileName = (0, path_1.basename)(file, ext);
            // fait parti des extensions et est final
            return EXTENSION.includes(ext) && (0, path_1.extname)(fileName) === '.final';
        })
        : [];
};
exports.command = 'evaluate [criterias..]';
exports.describe = 'evaluate the files with the algorithms';
var builder = function (yargs) {
    return yargs
        .positional('criterias', {
        describe: 'list of criterias to evaluate with',
        default: lib_1.CRITERIAS_NAMES
    })
        .options({
        initials: {
            alias: 'i',
            type: 'array',
            default: defaultOriginFiles(),
            defaultDescription: 'files in "' +
                ORIGIN_FOLDER +
                '" with ' +
                JSON_EXT +
                ' extension. Files with .final.json extension are ignored',
            describe: 'List of files containing the initial graphs.'
        },
        finals: {
            alias: 'f',
            default: defaultFinalFiles(),
            defaultDescription: 'files in "' +
                FINAL_FOLDER +
                '" with .final' +
                JSON_EXT +
                ' extension',
            type: 'array',
            describe: 'List of files containing the final graphs, retrieved from "' +
                FINAL_FOLDER +
                '" by default'
        },
        output: {
            alias: 'o',
            default: './data/',
            describe: 'folder where the evaluation result is saved'
        }
    });
};
exports.builder = builder;
var handler = function (_a) {
    var criterias = _a.criterias, finals = _a.finals, initials = _a.initials, folder = _a.output;
    criterias.sort();
    var mappedFinal = lodash_1.default.keyBy(finals, function (str) { return (0, path_1.basename)(str, '.final.json'); });
    var mappedInitial = lodash_1.default.keyBy(initials, function (str) { return (0, path_1.basename)(str, '.json'); });
    var pair = {};
    for (var key in mappedFinal) {
        var slicedkey = key.slice(0, key.lastIndexOf('_'));
        if (mappedInitial[slicedkey] === undefined)
            continue;
        var information = key.split('_');
        if (information.length < 4) {
            information = [
                information[0],
                '',
                '',
                information[information.length - 1]
            ];
        }
        pair[key] = {
            type: information[0],
            nodes: information[1],
            iteration: information[2],
            algorithm: information[information.length - 1],
            initial: mappedInitial[slicedkey],
            final: mappedFinal[key]
        };
    }
    if (lodash_1.default.keys(pair).length === 0)
        return console.log('No matching graphs have been found, aborting');
    (0, lib_1.evaluate)(criterias, pair, folder);
};
exports.handler = handler;
