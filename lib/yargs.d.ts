import { Argv } from 'yargs';
export declare const command = "evaluate [criterias..]";
export declare const describe = "evaluate the files with the algorithms";
export declare const builder: (yargs: Argv<{}>) => Argv<import("yargs").Omit<import("yargs").Omit<{
    criterias: string[];
} & {
    initials: (string | number)[] | undefined;
} & {
    i: (string | number)[] | undefined;
}, "initials"> & {
    initials: string[];
} & {
    finals: (string | number)[] | undefined;
} & {
    f: (string | number)[] | undefined;
}, "finals"> & {
    finals: string[];
} & {
    output: string;
}>;
export declare const handler: ({ criterias, finals, initials, output: folder }: {
    criterias: string[];
    initials: string[];
    finals: string[];
    output: string;
}) => void;
