import * as d3 from 'd3';
import { PlotOptions } from './options';
export interface WaterfallOptions extends PlotOptions {
    orientation: 'h';
    data: {
        x: (string | number)[];
        y: (string | number)[];
    };
    reverse?: boolean;
    baseValue?: number;
    negativeColor?: string;
    positiveColor?: string;
    shape?: 'default' | 'directed';
}
export declare class WaterfallPlot {
    private options;
    private svg?;
    constructor(options: WaterfallOptions);
    init(): {
        svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
        x?: d3.ScaleLinear<number, number> | d3.ScaleBand<string>;
        y?: d3.ScaleLinear<number, number> | d3.ScaleBand<string>;
    };
}
