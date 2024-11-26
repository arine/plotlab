import { PlotOptions } from './options';
import { WaterfallPlot } from './waterfall';

import * as utils from './utils';

export interface ShapOptions extends PlotOptions {
  baseValue: number;
  modelOutputScore: { [key: string]: number };
  featureValues: { [key: string]: number };
  numVisibleFeatures?: number;
  precision?: number;
}

const font10pxWidth = 8.025454;
const labelFontWidth = 6.021666;

export class ShapPlot {
  private options: ShapOptions;

  constructor(options: ShapOptions) {
    this.options = utils.initOptions(options);
    this.options.numVisibleFeatures = this.options.numVisibleFeatures || 5;
  }

  init() {
    // Sort data
    let data: [number, string, number][] = [];
    for (const key in this.options.modelOutputScore) {
      data.push([this.options.modelOutputScore[key], key,
        this.options.featureValues[key]]);
    }
    data.sort((a, b) => Math.abs(a[0] as number) > Math.abs(b[0] as number) ? -1 : 1);
    if (this.options.numVisibleFeatures! < data.length) {
      const invisibleFeatures = data.slice(this.options.numVisibleFeatures);
      data[this.options.numVisibleFeatures!] = [
        invisibleFeatures.reduce((acc, curr) => [
          (acc[0] as number) + (curr[0] as number),
          '',
          0
        ])[0],
        `${data.length - this.options.numVisibleFeatures!} other features`,
        0
      ];
      data = data.slice(0, this.options.numVisibleFeatures! + 1);
    }
    if (this.options.precision != null) {
      data.forEach((e) => {
        e[0] = parseFloat(e[0].toFixed(this.options.precision));
      });
    }
    // Set waterfall options
    const options = JSON.parse(JSON.stringify(this.options));   // Deep copy options
    options.data = {
      x: data.map((e) => e[0]),
      y: data.map((e) => e[1]),
    };
    options.orientation = 'h';
    options.reverse = true;
    options.shape = 'directed';
    options.xAxis!.label = '';
    const labelHeight = 12 - 2;
    // add space for the last guide label
    options.margin!.t! = this.options.margin!.t! + labelHeight;
    // add space for y axis tick value label
    options.margin!.l = options.margin!.l!
      + Math.max(...data.map((e) => `${e[2]} = ${e[1]}`.length)) * labelFontWidth
      - Math.max(...data.map((e) => e[1].length)) * labelFontWidth;
    // Make plot
    const plot = new WaterfallPlot(options);
    const ret = plot.init();
    const svg = ret.svg;
    const x = ret.x as d3.ScaleLinear<number, number>;
    const y = ret.y as d3.ScaleBand<string>;
    // calc last value
    let lastValue = this.options.baseValue;
    for (const e of data) {
      lastValue += e[0];
    }
    // add last guide label
    const guideLabel = svg.append('g')
      .append('text')
        .attr('x', Math.min(
          this.options.width! - this.options.margin!.r!,
          x(lastValue) + font10pxWidth * (5 + lastValue.toFixed(3).length) / 2
        ))
        .attr('y', this.options.margin!.t!)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'hanging')
        .attr('font-family', 'monospace')
        .attr('font-size', '10px');
    guideLabel.append('tspan')
      .text('f(x)');
    guideLabel.append('tspan')
      .attr('fill', '#999')
      .text(`=${lastValue.toFixed(3)}`);
    const baseValueLabel = svg.append('g')
      .attr('class', 'base-value-x-label')
      .append('text')
        .attr('x', x(this.options.baseValue))
        .attr('y', this.options.height! - this.options.margin!.b!)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'top')
        .attr('font-family', 'monospace')
        .attr('font-size', '10px');
    baseValueLabel.append('tspan')
      .attr('fill', '#000')
      .text('E[f(x)]');
    baseValueLabel.append('tspan')
      .attr('fill', '#999')
      .text(`=${this.options.baseValue.toFixed(3)}`);
    // Add y axis tick value (feature value) label
    const yAxisValArea = svg.append('g').attr('class', 'y-axis-value-labels');
    for (let i = 0; i < this.options.numVisibleFeatures!; ++i) {
      const feature = data[i][1];
      const featureValue = data[i][2];
      yAxisValArea.append('text')
        .attr('x', x.range()[0] - options.xAxis!.tickSize - 3 - (feature.length + 1) * labelFontWidth)
        .attr('y', y(feature)! + y.bandwidth() / 2)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '10px')
        .attr('fill', '#999')
        .text(`${featureValue} =`);
    }
  }
}
