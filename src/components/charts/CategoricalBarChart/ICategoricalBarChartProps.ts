import {ResponsiveDimensions} from "../shared/types";

export interface CategoricalDataItem {
  group: string;
  category: string;
  value: number;
}

export interface CategoricalBarChartProps {
  /**
   * Data for the chart - each item represents a bar with group, category, and value
   */
  data: CategoricalDataItem[];

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
   * Example: { "iPhone": "#5B9BD5", "Mac": "#ED7D31" }
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
   * Inset for bars (spacing between bars)
   * @default 0.2
   */
  inset?: number;

  /**
   * Padding for facets (spacing between groups)
   * @default 0.15
   */
  facetPadding?: number;

  /**
   * Title for the chart (optional)
   */
  title?: string;
}
