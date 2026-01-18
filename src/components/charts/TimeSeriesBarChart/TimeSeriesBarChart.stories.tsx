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
    barWidthDays: 15,
    barGapDays: 1,
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
    barWidthDays: 20,
  },
};

// Multiple categories example
const productSalesData: TimeSeriesDataItem[] = [
  {date: new Date("2025-01-01"), category: "Product A", value: 8500},
  {date: new Date("2025-01-01"), category: "Product B", value: 6200},
  {date: new Date("2025-01-01"), category: "Product C", value: 7800},

  {date: new Date("2025-02-01"), category: "Product A", value: 9200},
  {date: new Date("2025-02-01"), category: "Product B", value: 6800},
  {date: new Date("2025-02-01"), category: "Product C", value: 8100},

  {date: new Date("2025-03-01"), category: "Product A", value: 10500},
  {date: new Date("2025-03-01"), category: "Product B", value: 7500},
  {date: new Date("2025-03-01"), category: "Product C", value: 8900},

  {date: new Date("2025-04-01"), category: "Product A", value: 11200},
  {date: new Date("2025-04-01"), category: "Product B", value: 8200},
  {date: new Date("2025-04-01"), category: "Product C", value: 9500},
];

export const ThreeCategories: Story = {
  args: {
    data: productSalesData,
    title: "Product Sales Comparison",
    xLabel: "Month",
    yLabel: "Sales",
    yDomain: [0, 12000],
    yTickFormat: (d) => `${d / 1000}K`,
    colors: {
      "Product A": "#3498DB",
      "Product B": "#E74C3C",
      "Product C": "#F39C12",
    },
    barWidthDays: 8,
    barGapDays: 1,
  },
};

// Weekly data example
const weeklyTrafficData: TimeSeriesDataItem[] = [
  {date: new Date("2025-11-03"), category: "Mobile", value: 15000},
  {date: new Date("2025-11-03"), category: "Desktop", value: 12000},

  {date: new Date("2025-11-10"), category: "Mobile", value: 16500},
  {date: new Date("2025-11-10"), category: "Desktop", value: 11500},

  {date: new Date("2025-11-17"), category: "Mobile", value: 17200},
  {date: new Date("2025-11-17"), category: "Desktop", value: 13000},

  {date: new Date("2025-11-24"), category: "Mobile", value: 18000},
  {date: new Date("2025-11-24"), category: "Desktop", value: 14500},

  {date: new Date("2025-12-01"), category: "Mobile", value: 19500},
  {date: new Date("2025-12-01"), category: "Desktop", value: 15200},
];

export const WeeklyData: Story = {
  args: {
    data: weeklyTrafficData,
    title: "Weekly Traffic by Device",
    xLabel: "Week",
    yLabel: "Visits",
    yDomain: [0, 22000],
    yTickFormat: (d) => `${(d / 1000).toFixed(1)}K`,
    colors: {
      Mobile: "#9B59B6",
      Desktop: "#34495E",
    },
    barWidthDays: 5,
    barGapDays: 1,
    xTickFormat: (date) => {
      const month = date.toLocaleString("default", {month: "short"});
      const day = date.getDate();
      return `${month} ${day}`;
    },
  },
};

// Custom margins example
export const CustomMargins: Story = {
  args: {
    data: monthlyCabEData,
    title: "Custom Spacing Example",
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    marginLeft: 80,
    marginRight: 40,
    marginTop: 40,
    marginBottom: 100,
    offsetLeft: 20,
  },
};

// Narrow bars example
export const NarrowBars: Story = {
  args: {
    data: monthlyCabEData,
    title: "Narrow Bar Configuration",
    xLabel: "mon_yr",
    yLabel: "Sold CabE and Total CabE",
    yDomain: [0, 30000],
    yTickFormat: (d) => `${d / 1000}K`,
    barWidthDays: 8,
    barGapDays: 3,
  },
};

// Custom tick format example
const yearlyData: TimeSeriesDataItem[] = [
  {date: new Date("2020-01-01"), category: "Sales", value: 120000},
  {date: new Date("2020-01-01"), category: "Target", value: 110000},

  {date: new Date("2021-01-01"), category: "Sales", value: 145000},
  {date: new Date("2021-01-01"), category: "Target", value: 130000},

  {date: new Date("2022-01-01"), category: "Sales", value: 162000},
  {date: new Date("2022-01-01"), category: "Target", value: 155000},

  {date: new Date("2023-01-01"), category: "Sales", value: 178000},
  {date: new Date("2023-01-01"), category: "Target", value: 170000},

  {date: new Date("2024-01-01"), category: "Sales", value: 195000},
  {date: new Date("2024-01-01"), category: "Target", value: 190000},
];

export const YearlyComparison: Story = {
  args: {
    data: yearlyData,
    title: "Annual Sales vs Target",
    xLabel: "Year",
    yLabel: "Revenue ($)",
    yDomain: [0, 200000],
    yTickFormat: (d) => `$${(d / 1000).toFixed(0)}K`,
    xTickFormat: (date) => date.getFullYear().toString(),
    colors: {
      Sales: "#2ECC71",
      Target: "#95A5A6",
    },
    barWidthDays: 60,
    barGapDays: 10,
  },
};

// Single category example
const singleCategoryData: TimeSeriesDataItem[] = [
  {date: new Date("2025-01-01"), category: "Revenue", value: 25000},
  {date: new Date("2025-02-01"), category: "Revenue", value: 28000},
  {date: new Date("2025-03-01"), category: "Revenue", value: 26500},
  {date: new Date("2025-04-01"), category: "Revenue", value: 31000},
  {date: new Date("2025-05-01"), category: "Revenue", value: 33000},
  {date: new Date("2025-06-01"), category: "Revenue", value: 35000},
];

export const SingleCategory: Story = {
  args: {
    data: singleCategoryData,
    title: "Monthly Revenue",
    xLabel: "Month",
    yLabel: "Revenue ($)",
    yDomain: [0, 40000],
    yTickFormat: (d) => `$${(d / 1000).toFixed(0)}K`,
    colors: {
      Revenue: "#1ABC9C",
    },
    legend: false,
    barWidthDays: 15,
  },
};

// Minimal example
export const Minimal: Story = {
  args: {
    data: [
      {date: new Date("2025-01-01"), category: "A", value: 100},
      {date: new Date("2025-01-01"), category: "B", value: 150},
      {date: new Date("2025-02-01"), category: "A", value: 120},
      {date: new Date("2025-02-01"), category: "B", value: 180},
      {date: new Date("2025-03-01"), category: "A", value: 140},
      {date: new Date("2025-03-01"), category: "B", value: 160},
    ],
  },
};
