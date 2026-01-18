import type {Meta, StoryObj} from "@storybook/react";
import TimeSeriesBarChart from "./TimeSeriesBarChart";
import {TimeSeriesDataItem} from "./ITimeSeriesBarChartProps";

const meta: Meta<typeof TimeSeriesBarChart> = {
  title: "Charts/TimeSeriesBarChart",
  component: TimeSeriesBarChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data: Monthly CabE data (Feb-Dec 2025)
const monthlyCabEData: TimeSeriesDataItem[] = [
  {date: new Date("2025-02-01"), category: "Sold CabE", value: 10500},
  {date: new Date("2025-02-01"), category: "Total CabE", value: 20500},

  {date: new Date("2025-03-01"), category: "Sold CabE", value: 12000},
  {date: new Date("2025-03-01"), category: "Total CabE", value: 20200},

  {date: new Date("2025-04-01"), category: "Sold CabE", value: 11800},
  {date: new Date("2025-04-01"), category: "Total CabE", value: 21000},

  {date: new Date("2025-05-01"), category: "Sold CabE", value: 13000},
  {date: new Date("2025-05-01"), category: "Total CabE", value: 22500},

  {date: new Date("2025-06-01"), category: "Sold CabE", value: 13500},
  {date: new Date("2025-06-01"), category: "Total CabE", value: 23500},

  {date: new Date("2025-07-01"), category: "Sold CabE", value: 12800},
  {date: new Date("2025-07-01"), category: "Total CabE", value: 23000},

  {date: new Date("2025-08-01"), category: "Sold CabE", value: 13200},
  {date: new Date("2025-08-01"), category: "Total CabE", value: 24500},

  {date: new Date("2025-09-01"), category: "Sold CabE", value: 13800},
  {date: new Date("2025-09-01"), category: "Total CabE", value: 25000},

  {date: new Date("2025-10-01"), category: "Sold CabE", value: 15500},
  {date: new Date("2025-10-01"), category: "Total CabE", value: 26000},

  {date: new Date("2025-11-01"), category: "Sold CabE", value: 15200},
  {date: new Date("2025-11-01"), category: "Total CabE", value: 26500},

  {date: new Date("2025-12-01"), category: "Sold CabE", value: 14800},
  {date: new Date("2025-12-01"), category: "Total CabE", value: 27000},
];

export const Default: Story = {
  args: {
    data: monthlyCabEData,
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
  },
};

export const DarkMode: Story = {
  args: {
    data: monthlyCabEData,
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    darkMode: true,
    title: "Monthly CabE Comparison",
  },
  parameters: {
    backgrounds: {default: "dark"},
  },
};

export const WithTitle: Story = {
  args: {
    data: monthlyCabEData,
    title: "CabE Sales Over Time (2025)",
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
  },
};

export const CustomColors: Story = {
  args: {
    data: monthlyCabEData,
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    colors: {
      "Sold CabE": "#E74C3C",
      "Total CabE": "#3498DB",
    },
  },
};

export const NoLegend: Story = {
  args: {
    data: monthlyCabEData,
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    legend: false,
  },
};

export const WiderBars: Story = {
  args: {
    data: monthlyCabEData,
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    barWidthMs: 15 * 24 * 60 * 60 * 1000, // 15 days
    barGapMs: 1 * 24 * 60 * 60 * 1000, // 1 day gap
  },
};

// Example with fewer data points
const quarterlyData: TimeSeriesDataItem[] = [
  {date: new Date("2025-01-01"), category: "Revenue", value: 45000},
  {date: new Date("2025-01-01"), category: "Cost", value: 32000},

  {date: new Date("2025-04-01"), category: "Revenue", value: 48000},
  {date: new Date("2025-04-01"), category: "Cost", value: 34000},

  {date: new Date("2025-07-01"), category: "Revenue", value: 52000},
  {date: new Date("2025-07-01"), category: "Cost", value: 36000},

  {date: new Date("2025-10-01"), category: "Revenue", value: 50000},
  {date: new Date("2025-10-01"), category: "Cost", value: 35000},
];

export const QuarterlyData: Story = {
  args: {
    data: quarterlyData,
    xLabel: "Quarter",
    yLabel: "Amount ($)",
    yDomain: [0, 60000],
    yTickFormat: (d) => `$${d / 1000}K`,
    colors: {
      Revenue: "#27AE60",
      Cost: "#E67E22",
    },
    barWidthMs: 20 * 24 * 60 * 60 * 1000, // 20 days
  },
};
