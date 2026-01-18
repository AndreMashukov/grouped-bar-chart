import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TimeSeriesBarChart from './TimeSeriesBarChart';
import { TimeSeriesDataItem, CustomTooltipProps } from './ITimeSeriesBarChartProps';

// Sample data for stories
const energySalesData: TimeSeriesDataItem[] = [
  { date: new Date('2023-01-01'), category: 'Sold CabE', value: 45 },
  { date: new Date('2023-01-01'), category: 'Total CabE', value: 120 },
  { date: new Date('2023-02-01'), category: 'Sold CabE', value: 52 },
  { date: new Date('2023-02-01'), category: 'Total CabE', value: 125 },
  { date: new Date('2023-03-01'), category: 'Sold CabE', value: 58 },
  { date: new Date('2023-03-01'), category: 'Total CabE', value: 130 },
  { date: new Date('2023-04-01'), category: 'Sold CabE', value: 65 },
  { date: new Date('2023-04-01'), category: 'Total CabE', value: 135 },
  { date: new Date('2023-05-01'), category: 'Sold CabE', value: 72 },
  { date: new Date('2023-05-01'), category: 'Total CabE', value: 140 },
  { date: new Date('2023-06-01'), category: 'Sold CabE', value: 78 },
  { date: new Date('2023-06-01'), category: 'Total CabE', value: 145 },
];

const monthlySalesData: TimeSeriesDataItem[] = [
  { date: new Date('2023-01-01'), category: 'Product A', value: 150 },
  { date: new Date('2023-01-01'), category: 'Product B', value: 120 },
  { date: new Date('2023-01-01'), category: 'Product C', value: 90 },
  { date: new Date('2023-02-01'), category: 'Product A', value: 165 },
  { date: new Date('2023-02-01'), category: 'Product B', value: 130 },
  { date: new Date('2023-02-01'), category: 'Product C', value: 95 },
  { date: new Date('2023-03-01'), category: 'Product A', value: 180 },
  { date: new Date('2023-03-01'), category: 'Product B', value: 145 },
  { date: new Date('2023-03-01'), category: 'Product C', value: 105 },
  { date: new Date('2023-04-01'), category: 'Product A', value: 195 },
  { date: new Date('2023-04-01'), category: 'Product B', value: 155 },
  { date: new Date('2023-04-01'), category: 'Product C', value: 110 },
];

const quarterlyRevenueData: TimeSeriesDataItem[] = [
  { date: new Date('2022-01-01'), category: 'Service Revenue', value: 450 },
  { date: new Date('2022-01-01'), category: 'Product Revenue', value: 320 },
  { date: new Date('2022-04-01'), category: 'Service Revenue', value: 480 },
  { date: new Date('2022-04-01'), category: 'Product Revenue', value: 350 },
  { date: new Date('2022-07-01'), category: 'Service Revenue', value: 520 },
  { date: new Date('2022-07-01'), category: 'Product Revenue', value: 380 },
  { date: new Date('2022-10-01'), category: 'Service Revenue', value: 560 },
  { date: new Date('2022-10-01'), category: 'Product Revenue', value: 410 },
  { date: new Date('2023-01-01'), category: 'Service Revenue', value: 600 },
  { date: new Date('2023-01-01'), category: 'Product Revenue', value: 450 },
];

const meta = {
  title: 'Charts/TimeSeriesBarChart',
  component: TimeSeriesBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data items with date, category, and value',
      control: false,
    },
    width: {
      control: { type: 'number', min: 400, max: 1600, step: 50 },
      description: 'Width of the chart in pixels',
    },
    height: {
      control: { type: 'number', min: 300, max: 800, step: 50 },
      description: 'Height of the chart in pixels',
    },
    darkMode: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
    legend: {
      control: 'boolean',
      description: 'Show/hide legend',
    },
    xLabel: {
      control: 'text',
      description: 'Label for X-axis',
    },
    yLabel: {
      control: 'text',
      description: 'Label for Y-axis',
    },
    title: {
      control: 'text',
      description: 'Chart title',
    },
    barWidthDays: {
      control: { type: 'number', min: 1, max: 30, step: 1 },
      description: 'Width of each bar in days',
    },
    barGapDays: {
      control: { type: 'number', min: 0, max: 20, step: 1 },
      description: 'Gap between bars in days',
    },
    numberOfTicks: {
      control: { type: 'number', min: 3, max: 10, step: 1 },
      description: 'Number of ticks on Y-axis',
    },
    showXAxisLine: {
      control: 'boolean',
      description: 'Show/hide X-axis line',
    },
    showYAxisLine: {
      control: 'boolean',
      description: 'Show/hide Y-axis line',
    },
    offsetLeft: {
      control: { type: 'number', min: 0, max: 100, step: 5 },
      description: 'Left offset for chart content',
    },
  },
} satisfies Meta<typeof TimeSeriesBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with energy sales data
export const Default: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Energy Sales Over Time',
  },
};

// Monthly sales with three products
export const MonthlySales: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Monthly Product Sales',
    colors: {
      'Product A': '#2E86AB',
      'Product B': '#A23B72',
      'Product C': '#F18F01',
    },
  },
};

// Quarterly revenue
export const QuarterlyRevenue: Story = {
  args: {
    data: quarterlyRevenueData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Revenue (Thousands)',
    title: 'Quarterly Revenue Comparison',
    barWidthDays: 20,
    barGapDays: 5,
    colors: {
      'Service Revenue': '#4CAF50',
      'Product Revenue': '#2196F3',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    darkMode: true,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Energy Sales (Dark Mode)',
  },
};

// Without legend
export const NoLegend: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: false,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Sales Data Without Legend',
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Custom Color Scheme',
    colors: {
      'Sold CabE': '#FF6B6B',
      'Total CabE': '#4ECDC4',
    },
  },
};

// Narrow bars
export const NarrowBars: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: true,
    barWidthDays: 6,
    barGapDays: 2,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Narrow Bar Width',
  },
};

// Wide bars with tight spacing
export const WideBars: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    barWidthDays: 18,
    barGapDays: 1,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Wide Bar Width',
  },
};

// Custom Y-axis format
export const CustomYAxisFormat: Story = {
  args: {
    data: quarterlyRevenueData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Revenue',
    title: 'Custom Y-Axis Format',
    yTickFormat: (value: number) => `$${value}K`,
  },
};

// Custom X-axis format
export const CustomXAxisFormat: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    xLabel: 'Date',
    yLabel: 'Energy (CabE)',
    title: 'Custom X-Axis Format',
    xTickFormat: (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
    },
  },
};

// Custom Y-domain
export const CustomYDomain: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    yDomain: [0, 200],
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Fixed Y-Axis Range (0-200)',
  },
};

// No axis lines
export const NoAxisLines: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: true,
    showXAxisLine: false,
    showYAxisLine: false,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Chart Without Axis Lines',
  },
};

// Custom margins
export const CustomMargins: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    marginLeft: 100,
    marginBottom: 120,
    marginTop: 50,
    marginRight: 50,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Custom Margins',
  },
};

// Styled labels
export const StyledLabels: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Custom Label Styling',
    xLabelStyle: {
      fontSize: '18px',
      fontWeight: 'bold',
      fill: '#5B9BD5',
    },
    yLabelStyle: {
      fontSize: '18px',
      fontWeight: 'bold',
      fill: '#ED7D31',
    },
  },
};

// More ticks
export const MoreTicks: Story = {
  args: {
    data: quarterlyRevenueData,
    width: 1200,
    height: 500,
    legend: true,
    numberOfTicks: 10,
    xLabel: 'Quarter',
    yLabel: 'Revenue (Thousands)',
    title: '10 Y-Axis Ticks',
  },
};

// Fewer ticks
export const FewerTicks: Story = {
  args: {
    data: quarterlyRevenueData,
    width: 1200,
    height: 500,
    legend: true,
    numberOfTicks: 3,
    xLabel: 'Quarter',
    yLabel: 'Revenue (Thousands)',
    title: '3 Y-Axis Ticks',
  },
};

// Small chart
export const SmallChart: Story = {
  args: {
    data: energySalesData,
    width: 800,
    height: 350,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Energy',
    title: 'Compact Size Chart',
  },
};

// Large chart
export const LargeChart: Story = {
  args: {
    data: monthlySalesData,
    width: 1600,
    height: 700,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Large Size Chart',
  },
};

// Minimal data (2 dates, 2 categories)
export const MinimalData: Story = {
  args: {
    data: [
      { date: new Date('2023-01-01'), category: 'Category A', value: 50 },
      { date: new Date('2023-01-01'), category: 'Category B', value: 75 },
      { date: new Date('2023-02-01'), category: 'Category A', value: 60 },
      { date: new Date('2023-02-01'), category: 'Category B', value: 85 },
    ],
    width: 800,
    height: 400,
    legend: true,
    xLabel: 'Date',
    yLabel: 'Value',
    title: 'Minimal Dataset',
    colors: {
      'Category A': '#3498db',
      'Category B': '#e74c3c',
    },
  },
};

// With offset
export const WithOffset: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    offsetLeft: 50,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Chart With Left Offset',
  },
};

// Long time range
export const LongTimeRange: Story = {
  args: {
    data: [
      { date: new Date('2021-01-01'), category: 'Sales', value: 100 },
      { date: new Date('2021-01-01'), category: 'Target', value: 120 },
      { date: new Date('2021-06-01'), category: 'Sales', value: 110 },
      { date: new Date('2021-06-01'), category: 'Target', value: 125 },
      { date: new Date('2022-01-01'), category: 'Sales', value: 125 },
      { date: new Date('2022-01-01'), category: 'Target', value: 130 },
      { date: new Date('2022-06-01'), category: 'Sales', value: 140 },
      { date: new Date('2022-06-01'), category: 'Target', value: 140 },
      { date: new Date('2023-01-01'), category: 'Sales', value: 150 },
      { date: new Date('2023-01-01'), category: 'Target', value: 150 },
      { date: new Date('2023-06-01'), category: 'Sales', value: 165 },
      { date: new Date('2023-06-01'), category: 'Target', value: 155 },
    ],
    width: 1400,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Performance',
    title: 'Multi-Year Comparison',
    barWidthDays: 15,
    colors: {
      Sales: '#00BCD4',
      Target: '#FF9800',
    },
  },
};

// Custom Tooltip as a React Component
const CustomTooltipComponent: React.FC<CustomTooltipProps> = ({ dataPoints, date }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      minWidth: '150px',
    }}
  >
    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
      📅 {date?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
    </div>
    {dataPoints.map((point, index) => (
      <div
        key={index}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: point.color,
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
          {point.label}
        </span>
        <span style={{ fontWeight: 'bold' }}>{point.value}</span>
      </div>
    ))}
  </div>
);

export const WithCustomTooltipComponent: Story = {
  args: {
    data: energySalesData,
    width: 1400,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Energy (CabE)',
    title: 'Custom Tooltip Component',
    customTooltipElement: CustomTooltipComponent,
  },
};

// Custom Tooltip as a Render Function
export const WithCustomTooltipRenderFunction: Story = {
  args: {
    data: monthlySalesData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Month',
    yLabel: 'Sales (Units)',
    title: 'Custom Tooltip (Render Function)',
    colors: {
      'Product A': '#2E86AB',
      'Product B': '#A23B72',
      'Product C': '#F18F01',
    },
    customTooltipElement: ({ dataPoints, date }: CustomTooltipProps) => (
      <div
        style={{
          backgroundColor: '#1a1a2e',
          color: '#eee',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #4a4a6a',
          fontSize: '13px',
        }}
      >
        <div style={{ borderBottom: '1px solid #4a4a6a', paddingBottom: '6px', marginBottom: '6px' }}>
          🗓 {date?.toLocaleDateString()}
        </div>
        {dataPoints.map((point, i) => (
          <div key={i} style={{ padding: '3px 0' }}>
            <span style={{ color: point.color }}>●</span> {point.label}: <strong>{point.value} units</strong>
          </div>
        ))}
      </div>
    ),
  },
};

// Custom Tooltip in Dark Mode
export const CustomTooltipDarkMode: Story = {
  args: {
    data: quarterlyRevenueData,
    width: 1200,
    height: 500,
    darkMode: true,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Revenue (Thousands)',
    title: 'Custom Tooltip (Dark Mode)',
    colors: {
      'Service Revenue': '#4CAF50',
      'Product Revenue': '#2196F3',
    },
    customTooltipElement: ({ dataPoints, date }: CustomTooltipProps) => (
      <div
        style={{
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          color: '#fff',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #444',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>
          {date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        {dataPoints.map((point, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: point.color,
                borderRadius: '4px',
              }}
            />
            <span>{point.label}:</span>
            <span style={{ fontWeight: 'bold' }}>${point.value}K</span>
          </div>
        ))}
      </div>
    ),
  },
};
