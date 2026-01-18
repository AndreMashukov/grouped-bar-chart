import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CategoricalBarChart from './CategoricalBarChart';
import { CategoricalDataItem, CustomTooltipProps } from './ICategoricalBarChartProps';

// Sample data for stories
const appleProductData: CategoricalDataItem[] = [
  { group: '2019', category: 'iPhone', value: 142 },
  { group: '2019', category: 'Mac', value: 26 },
  { group: '2019', category: 'iPad', value: 21 },
  { group: '2019', category: 'Wearables', value: 24 },
  { group: '2019', category: 'Services', value: 46 },
  { group: '2020', category: 'iPhone', value: 138 },
  { group: '2020', category: 'Mac', value: 28 },
  { group: '2020', category: 'iPad', value: 24 },
  { group: '2020', category: 'Wearables', value: 31 },
  { group: '2020', category: 'Services', value: 54 },
  { group: '2021', category: 'iPhone', value: 192 },
  { group: '2021', category: 'Mac', value: 35 },
  { group: '2021', category: 'iPad', value: 32 },
  { group: '2021', category: 'Wearables', value: 38 },
  { group: '2021', category: 'Services', value: 68 },
  { group: '2022', category: 'iPhone', value: 205 },
  { group: '2022', category: 'Mac', value: 40 },
  { group: '2022', category: 'iPad', value: 29 },
  { group: '2022', category: 'Wearables', value: 41 },
  { group: '2022', category: 'Services', value: 78 },
];

const salesByRegion: CategoricalDataItem[] = [
  { group: 'Q1', category: 'North America', value: 120 },
  { group: 'Q1', category: 'Europe', value: 90 },
  { group: 'Q1', category: 'Asia', value: 150 },
  { group: 'Q2', category: 'North America', value: 135 },
  { group: 'Q2', category: 'Europe', value: 100 },
  { group: 'Q2', category: 'Asia', value: 165 },
  { group: 'Q3', category: 'North America', value: 145 },
  { group: 'Q3', category: 'Europe', value: 110 },
  { group: 'Q3', category: 'Asia', value: 180 },
  { group: 'Q4', category: 'North America', value: 160 },
  { group: 'Q4', category: 'Europe', value: 125 },
  { group: 'Q4', category: 'Asia', value: 200 },
];

const meta = {
  title: 'Charts/CategoricalBarChart',
  component: CategoricalBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data items with group, category, and value',
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
    barPadding: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.05 },
      description: 'Padding between bars within a group',
    },
    groupPadding: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.05 },
      description: 'Padding between groups',
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
  },
} satisfies Meta<typeof CategoricalBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with Apple product data
export const Default: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Apple Product Revenue by Year',
  },
};

// Sales by region
export const SalesByRegion: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Regional Sales Performance',
    colors: {
      'North America': '#2E86AB',
      'Europe': '#A23B72',
      'Asia': '#F18F01',
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    darkMode: true,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Apple Product Revenue (Dark Mode)',
  },
};

// Without legend
export const NoLegend: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: false,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Sales Data Without Legend',
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Custom Color Scheme',
    colors: {
      iPhone: '#FF6B6B',
      Mac: '#4ECDC4',
      iPad: '#45B7D1',
      Wearables: '#FFA07A',
      Services: '#98D8C8',
    },
  },
};

// Tight spacing
export const TightSpacing: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: true,
    barPadding: 0.05,
    groupPadding: 0.1,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Tight Bar Spacing',
  },
};

// Wide spacing
export const WideSpacing: Story = {
  args: {
    data: salesByRegion,
    width: 1200,
    height: 500,
    legend: true,
    barPadding: 0.3,
    groupPadding: 0.4,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Wide Bar Spacing',
  },
};

// Custom Y-axis format
export const CustomYAxisFormat: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue',
    title: 'Custom Y-Axis Format',
    yTickFormat: (value: number) => `$${value}B`,
  },
};

// Custom Y-domain
export const CustomYDomain: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: true,
    yDomain: [0, 250],
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Fixed Y-Axis Range (0-250)',
  },
};

// No axis lines
export const NoAxisLines: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    showXAxisLine: false,
    showYAxisLine: false,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Chart Without Axis Lines',
  },
};

// Custom margins
export const CustomMargins: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: true,
    marginLeft: 100,
    marginBottom: 100,
    marginTop: 50,
    marginRight: 50,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Custom Margins',
  },
};

// Styled labels
export const StyledLabels: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
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
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    numberOfTicks: 10,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: '10 Y-Axis Ticks',
  },
};

// Fewer ticks
export const FewerTicks: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    numberOfTicks: 3,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: '3 Y-Axis Ticks',
  },
};

// Small chart
export const SmallChart: Story = {
  args: {
    data: salesByRegion,
    width: 600,
    height: 350,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Sales',
    title: 'Compact Size Chart',
  },
};

// Large chart
export const LargeChart: Story = {
  args: {
    data: appleProductData,
    width: 1600,
    height: 700,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Large Size Chart',
  },
};

// Minimal data (2 groups, 2 categories)
export const MinimalData: Story = {
  args: {
    data: [
      { group: 'A', category: 'X', value: 50 },
      { group: 'A', category: 'Y', value: 75 },
      { group: 'B', category: 'X', value: 60 },
      { group: 'B', category: 'Y', value: 85 },
    ],
    width: 600,
    height: 400,
    legend: true,
    xLabel: 'Group',
    yLabel: 'Value',
    title: 'Minimal Dataset',
    colors: {
      X: '#3498db',
      Y: '#e74c3c',
    },
  },
};

// Custom Tooltip as a React Component
const CustomTooltipComponent: React.FC<CustomTooltipProps> = ({ dataPoints, group }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      minWidth: '140px',
    }}
  >
    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
      📊 {group}
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
    data: appleProductData,
    width: 1200,
    height: 500,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Custom Tooltip Component',
    customTooltipElement: CustomTooltipComponent,
  },
};

// Custom Tooltip as a Render Function
export const WithCustomTooltipRenderFunction: Story = {
  args: {
    data: salesByRegion,
    width: 1000,
    height: 500,
    legend: true,
    xLabel: 'Quarter',
    yLabel: 'Sales (Millions)',
    title: 'Custom Tooltip (Render Function)',
    colors: {
      'North America': '#2E86AB',
      'Europe': '#A23B72',
      'Asia': '#F18F01',
    },
    customTooltipElement: ({ dataPoints, group }: CustomTooltipProps) => (
      <div
        style={{
          backgroundColor: '#2c3e50',
          color: '#ecf0f1',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '2px solid #3498db',
          fontSize: '13px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#3498db' }}>
          Quarter: {group}
        </div>
        {dataPoints.map((point, i) => (
          <div key={i} style={{ padding: '3px 0' }}>
            <span style={{ color: point.color }}>■</span> {point.label}: <strong>${point.value}M</strong>
          </div>
        ))}
      </div>
    ),
  },
};

// Custom Tooltip in Dark Mode
export const CustomTooltipDarkMode: Story = {
  args: {
    data: appleProductData,
    width: 1200,
    height: 500,
    darkMode: true,
    legend: true,
    xLabel: 'Year',
    yLabel: 'Revenue (Billions USD)',
    title: 'Custom Tooltip (Dark Mode)',
    customTooltipElement: ({ dataPoints, group }: CustomTooltipProps) => (
      <div
        style={{
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          color: '#fff',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #555',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
          📈 Fiscal Year {group}
        </div>
        {dataPoints.map((point, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                backgroundColor: point.color,
                borderRadius: '3px',
              }}
            />
            <span>{point.label}:</span>
            <span style={{ fontWeight: 'bold' }}>${point.value}B</span>
          </div>
        ))}
      </div>
    ),
  },
};
