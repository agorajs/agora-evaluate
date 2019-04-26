export interface Information {
    type: string;
    nodes: string;
    iteration: string;
    initial: string;
    final: string;
    algorithm: string;
}
export declare const CRITERIAS_NAMES: string[];
export declare function evaluate(criteriasShort: string[], informations: {
    [k: string]: Information;
}, folder: string): void;
