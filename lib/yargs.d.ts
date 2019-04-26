import { Argv } from 'yargs';
export declare const command = "evaluate [criterias..]";
export declare const describe = "evaluate the files with the algorithms";
export declare const builder: (yargs: Argv<{}>) => Argv<import("yargs").Omit<{
    criterias: string[];
}, "finals" | "initials" | "output"> & import("yargs").InferredOptionTypes<{
    initials: {
        alias: string;
        type: "array";
        default: string[];
        defaultDescription: string;
        describe: string;
    };
    finals: {
        alias: string;
        default: string[];
        defaultDescription: string;
        type: "array";
        describe: string;
    };
    output: {
        alias: string;
        default: string;
        describe: string;
    };
}>>;
export declare const handler: ({ criterias, finals, initials, output: folder }: {
    criterias: string[];
    initials: string[];
    finals: string[];
    output: string;
}) => void;
