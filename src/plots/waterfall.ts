import * as d3 from 'd3';

import { PlotOptions } from './options';
import * as utils from './utils';

type D3Selection = d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;

const labelFontWidth = 6.021666;

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

export class WaterfallPlot {
  private options: WaterfallOptions;
  private svg?: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;

  constructor(options: WaterfallOptions) {
    this.options = utils.initOptions(options);
    this.options.positiveColor = this.options.positiveColor || '#ff0052';
    this.options.negativeColor = this.options.negativeColor || '#038bfb';
    this.options.shape = this.options.shape || 'default';
  }

  init(): {
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    x?: d3.ScaleLinear<number, number> | d3.ScaleBand< string >,
    y?: d3.ScaleLinear<number, number> | d3.ScaleBand< string >
  } {
    // Init svg
    this.svg = d3.select(this.options.elementId).append('svg');
    if (this.options.backgroundColor) {
      // Add background
      this.svg.append('rect')
        .attr('width', this.options.width!)
        .attr('height', this.options.height!)
        .attr('fill', this.options.backgroundColor);
    }
    if (this.options.width) {
      this.svg.attr('width', this.options.width);
    }
    if (this.options.height) {
      this.svg.attr('height', this.options.height);
    }

    // set values to use according to orientation
    const data = [];
    const reversedData = [];
    if (this.options.orientation === 'h') {
      for (let i = 0; i < this.options.data.x.length; ++i) {
        data.push([this.options.data.x[i], this.options.data.y[i]]);
        reversedData[this.options.data.x.length - i - 1] =
          [this.options.data.x[i], this.options.data.y[i]];
      }
    } else {
      for (let i = 0; i < this.options.data.x.length; ++i) {
        data.push([this.options.data.y[i], this.options.data.x[i]]);
        reversedData[this.options.data.x.length - i - 1] =
          [this.options.data.x[i], this.options.data.y[i]];
      }
    }
    // Calculate range
    let currValue = this.options.baseValue || 0;
    let minValue = currValue + (data[0][0] as number);
    let maxValue = currValue + (data[0][0] as number);
    (this.options.reverse ? reversedData : data).forEach((datapoint) => {
      currValue += datapoint[0] as number;
      minValue = Math.min(minValue, currValue);
      maxValue = Math.max(maxValue, currValue);
    });

    if (this.options.orientation === 'h') {
      // Calculate horizontal padding
      const paddingX = (maxValue - minValue) * 0.05;
      // Calculate x axis height
      const xAxisHeight = 11    // font height
        + this.options.xAxis!.tickSize!   // tick size
        + 3     // space between a tick label and a tick
        + (this.options.xAxis!.label != null ? 12 : 0);   // x axis label height
      // Calculate y axis width
      const yAxisWidth = Math.max(...data.map((e) => (e[1] as string).length)) * labelFontWidth
        + this.options.yAxis!.tickSize!   // tick size
        + 3;    // space between a tick label and a tick
      // init x domain
      const x: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .domain([minValue - paddingX, maxValue + paddingX])
        .range([
          this.options.margin!.l! + yAxisWidth,
          this.options.width! - this.options.margin!.r!,
        ]);
      // init y domain
      const y: d3.ScaleBand<string> = d3.scaleBand()
        .paddingInner(0.125)
        .paddingOuter(0.25)
        .domain(data.map((e) => e[1] as string))
        .range([
          0 + this.options.margin!.t!,
          this.options.height! - this.options.margin!.b! - xAxisHeight,
        ]);
      // Draw grids
      if (this.options.xAxis!.grid) {
        // draw x grids
        this.svg.append('g')
          .attr('class', 'x-grid')
          .selectAll('line')
          .data(x.ticks())
            .join('line')
            .attr('x1', (d) => x(d))
            .attr('x2', (d) => x(d))
            .attr('y1', this.options.margin!.t!)
            .attr('y2', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('stroke', '#eee')
            .attr('stroke-width', 1);
      }
      if (this.options.yAxis!.grid) {
        // draw y grids
        this.svg.append('g')
          .attr('class', 'y-grid')
          .selectAll('line')
          .data(y.domain())
            .join('line')
            .attr('y1', (d: string) => y(d)! + y.bandwidth() / 2)
            .attr('y2', (d: string) => y(d)! + y.bandwidth() / 2)
            .attr('x1', this.options.margin!.l! + yAxisWidth)
            .attr('x2', this.options.width! - this.options.margin!.r!)
            .attr('stroke', '#eee')
            .attr('stroke-width', 1);
      }
      if (!this.options.xAxis!.hidden) {
        // Draw bars and guides
        const barArea = this.svg.append('g').attr('class', 'bars');
        let base = this.options.baseValue || 0;
        if (this.options.reverse) {
          let lastY = this.options.height! - this.options.margin!.b! - xAxisHeight
            - y.paddingOuter() * y.bandwidth();
          for (let i = this.options.data.x.length - 1; i >= 0; --i) {
            const xVal = this.options.data.x[i] as number;
            const yVal = this.options.data.y[i] as string;
            let bar;
            if (this.options.shape === 'default') {
              bar = barArea.append('rect')
                .attr('x', xVal > 0 ? x(base) : x(base + xVal))
                .attr('y', y(yVal)!)
                .attr('width', xVal > 0 ? x(base + xVal) - x(base) : x(base) - x(base + xVal))
                .attr('height', y.bandwidth())
            } else {
              bar = barArea.append('path');
              if (xVal > 0) {
                bar.attr('d', `M${x(base)} ${y(yVal)} ` +
                  `L${x(base + xVal) - 10} ${y(yVal)} `+
                  `L${x(base + xVal)} ${y(yVal)! + y.bandwidth() / 2} ` +
                  `L${x(base + xVal) - 10} ${y(yVal)! + y.bandwidth()} ` +
                  `L${x(base)} ${y(yVal)! + y.bandwidth()} ` +
                  `L${x(base)} ${y(yVal)}`);
              } else {
                bar.attr('d', `M${x(base)} ${y(yVal)} ` +
                  `L${x(base + xVal) + 10} ${y(yVal)} `+
                  `L${x(base + xVal)} ${y(yVal)! + y.bandwidth() / 2} ` +
                  `L${x(base + xVal) + 10} ${y(yVal)! + y.bandwidth()} ` +
                  `L${x(base)} ${y(yVal)! + y.bandwidth()} ` +
                  `L${x(base)} ${y(yVal)}`);
              }
            }
            bar.attr('fill', xVal > 0 ? this.options.positiveColor! : this.options.negativeColor!);
            // Add label
            barArea.append('text')
              .attr('x', (x(base) + x(base + xVal)) / 2)
              .attr('y', y(yVal)! + y.bandwidth() / 2)
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'central')
              .attr('fill', '#fff')
              .attr('font-size', '10pt')
              .text(xVal + '');
            base += xVal;
            // add guide line
            barArea.append('line')
              .attr('x1', x(base))
              .attr('x2', x(base))
              .attr('y1', lastY)
              .attr('y2', y(yVal)! - y.bandwidth() * y.paddingInner())
              .attr('stroke', '#999')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', 1);
            lastY = y(yVal)!;
          }
          // last guide goes down to the x axis
          barArea.append('line')
            .attr('x1', x(base))
            .attr('x2', x(base))
            .attr('y1', lastY + y.bandwidth() * (1 + y.paddingInner()))
            .attr('y2', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 1);
          // draw base value guide
          barArea.append('line')
            .attr('x1', x(this.options.baseValue || 0))
            .attr('x2', x(this.options.baseValue || 0))
            .attr('y1', this.options.height! - this.options.margin!.b! - xAxisHeight - y.bandwidth() * y.paddingOuter())
            .attr('y2', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 1);
          // draw x axis
          this.svg.append('line')
            .attr('class', 'x-axis-line')
            .attr('x1', this.options.margin!.l! + yAxisWidth)
            .attr('x2', this.options.width! - this.options.margin!.r!)
            .attr('y1', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('y2', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('stroke', '#000')
            .attr('stroke-width', this.options.xAxis!.strokeWidth || 0);
            const xAxis = (g: D3Selection) => g
              .attr('class', 'x-axis')
              .attr('transform', `translate(0,${this.options.height! - this.options.margin!.b! - xAxisHeight})`)
              .call(
                d3.axisBottom(x)
                  .tickSize(this.options.xAxis!.tickSize!)
              )
              .call((gr: D3Selection) => gr.select('.domain').remove());
          this.svg.append('g').call(xAxis)
            .selectAll('text')
              .style('font-family', 'monospace');
        }
        // draw y axis
        if (!this.options.yAxis!.hidden) {
          this.svg.append('line')
            .attr('class', 'y-axis-line')
            .attr('x1', this.options.margin!.l! + yAxisWidth)
            .attr('x2', this.options.margin!.l! + yAxisWidth)
            .attr('y1', this.options.margin!.t!)
            .attr('y2', this.options.height! - this.options.margin!.b! - xAxisHeight)
            .attr('stroke', '#000')
            .attr('stroke-width', this.options.yAxis!.strokeWidth || 0);
          const yAxis = (g: D3Selection) => g
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.options.margin!.l! + yAxisWidth},0)`)
            .call(
              d3.axisLeft(y)
                .tickSize(this.options.yAxis!.tickSize!)
            )
            .call((gr: D3Selection) => gr.select('.domain').remove());
          this.svg.append('g').call(yAxis)
            .selectAll('text')
              .style('font-family', 'monospace');
        }
      }
      return {
        svg: this.svg!,
        x, y
      };
    }
    return {
      svg: this.svg!
    };
  }
}
