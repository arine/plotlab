import { PlotOptions } from './options';

export function initOptions<T extends PlotOptions>(options: T): T {
  if (options.width == null) {
    options.width =
      document.getElementById(options.elementId)?.offsetWidth || 500;
  }
  if (options.height == null) {
    options.height =
      document.getElementById(options.elementId)?.offsetHeight || 500;
  }
  // set default margin
  options.margin = options.margin || {};
  options.margin.t = options.margin.t || 0;
  options.margin.r = options.margin.r || 0;
  options.margin.b = options.margin.b || 0;
  options.margin.l = options.margin.l || 0;
  // set default axis options
  options.xAxis = options.xAxis || {};
  options.xAxis.tickSize = options.xAxis.tickSize || 6;
  options.yAxis = options.yAxis || {};
  options.yAxis.tickSize = options.yAxis.tickSize || 6;
  return options;
}
