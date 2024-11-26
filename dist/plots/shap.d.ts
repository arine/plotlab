import { PlotOptions } from './options';
export interface ShapOptions extends PlotOptions {
    baseValue: number;
    modelOutputScore: {
        [key: string]: number;
    };
    featureValues: {
        [key: string]: number;
    };
    numVisibleFeatures?: number;
    precision?: number;
}
export declare class ShapPlot {
    private options;
    constructor(options: ShapOptions);
    init(): void;
}
