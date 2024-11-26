interface FourDir {
    t?: number;
    r?: number;
    b?: number;
    l?: number;
}
interface AxisOption {
    tickSize?: number;
    label?: string;
    grid?: boolean;
    strokeWidth?: number;
    hidden?: boolean;
}
export interface PlotOptions {
    elementId: string;
    width?: number;
    height?: number;
    margin?: FourDir;
    xAxis?: AxisOption;
    yAxis?: AxisOption;
    backgroundColor?: string;
}
export {};
