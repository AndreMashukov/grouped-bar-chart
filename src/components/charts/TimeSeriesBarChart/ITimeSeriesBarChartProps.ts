import {ResponsiveDimensions} from "../shared/types";

export interface TimeSeriesDataItem {
  date: Date;
  category: string;
  value: number;
}

export interface TimeSeriesBarChartProps {
  /**
   * Data for the chart - each item represents a bar with date, category, and value
   */
  data: TimeSeriesDataItem[];

  /**
   * Width of the chart (number or responsive breakpoints)
   */
  width?: number | ResponsiveDimensions;

  /**
   * Height of the chart (number or responsive breakpoints)
   */
  height?: number | ResponsiveDimensions;

  /**
   * Color mapping for categories
   * Example: { "Sold CabE": "#A0616A", "Total CabE": "#BDB76B" }
   */
  colors?: Record<string, string>;

  /**
   * Whether to show the legend
   * @default true
   */
  legend?: boolean;

  /**
   * X-axis label
   */
  xLabel?: string | null;

  /**
   * Y-axis label
   */
  yLabel?: string | null;

  /**
   * Dark mode styling
   * @default false
   */
  darkMode?: boolean;

  /**
   * Y-axis domain [min, max]
   */
  yDomain?: [number, number];

  /**
   * Margin left (for y-axis labels)
   * @default 60
   */
  marginLeft?: number;

  /**
   * Margin bottom (for x-axis labels)
   * @default 80
   */
  marginBottom?: number;

  /**
   * Margin top
   * @default 20
   */
  marginTop?: number;

  /**
   * Margin right
   * @default 20
   */
  marginRight?: number;

  /**
   * Custom y-axis tick format function
   */
  yTickFormat?: (value: number) => string;

  /**
   * Custom x-axis tick format function
   */
  xTickFormat?: (value: Date) => string;

  /**
   * Bar width in milliseconds
   * @default 12 days (12 * 24 * 60 * 60 * 1000)
   */
  barWidthMs?: number;

  /**
   * Gap between bars in milliseconds
   * @default 2 days (2 * 24 * 60 * 60 * 1000)
   */
  barGapMs?: number;

  /**
   * Title for the chart (optional)
   */
  title?: string;
}
