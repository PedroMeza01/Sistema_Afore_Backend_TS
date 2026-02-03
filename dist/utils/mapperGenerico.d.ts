type Path = string;
type Rule<S, TVal> = Path | ((src: S) => TVal) | {
    from?: Path;
    map?: (val: any, src: S) => TVal;
    default?: any;
    const?: any;
};
export type MapConfig<S, T> = {
    [K in keyof T]?: Rule<S, T[K]>;
};
export declare function makeMapper<S extends object, T extends object>(config: MapConfig<S, T>, opts?: {
    autoCopy?: boolean;
}): (src: S) => T;
export declare const mapArray: <S extends object, T extends object>(config: MapConfig<S, T>, items: S[], opts?: {
    autoCopy?: boolean;
}) => T[];
export declare const asNum: (x: any) => number;
export declare const asISO: (x: any) => string;
export {};
