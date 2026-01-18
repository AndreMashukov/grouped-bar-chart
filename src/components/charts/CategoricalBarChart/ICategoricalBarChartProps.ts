import {ResponsiveDimensions} from "../shared/types";
import {CustomTooltipProps} from "../shared/FlexibleTooltip";

export type {CustomTooltipProps};

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
   * Style object for X-axis label
   * @example { fontSize: '16px', fontWeight: 'bold', fill: '#333' }
   */
  xLabelStyle?: React.CSSProperties;

  /**
   * Y-axis label
   */
  yLabel?: string | null;

  /**
   * Style object for Y-axis label
   * @example { fontSize: '16px', fontWeight: 'bold', fill: '#333' }
   */
  yLabelStyle?: React.CSSProperties;

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
   * Number of ticks on the y-axis
   * @default 5
   */
  numberOfTicks?: number;

  /**
   * Custom y-axis tick format function
   */
  yTickFormat?: (value: number) => string;

  /**
   * Padding between bars within a group (0-1)
   * @default 0.1
   */
  barPadding?: number;

  /**
   * Padding between groups (0-1)
   * @default 0.2
   */
  groupPadding?: number;

  /**
   * Whether to show X-axis line
   * @default true
   */
  showXAxisLine?: boolean;

  /**
   * Whether to show Y-axis line
   * @default true
   */
  showYAxisLine?: boolean;

  /**
   * Title for the chart (optional)
   */
  title?: string;

  /**
   * Custom tooltip element or component
   * Can be a React element, a component that receives CustomTooltipProps, or a render function
   */
  customTooltipElement?:
    | React.ReactNode
    | React.ComponentType<CustomTooltipProps>
    | ((props: CustomTooltipProps) => React.ReactNode);
}
