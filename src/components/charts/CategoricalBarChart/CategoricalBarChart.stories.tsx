import type {Meta, StoryObj} from "@storybook/react";
import CategoricalBarChart from "./CategoricalBarChart";
import {CategoricalDataItem} from "./ICategoricalBarChartProps";

const meta: Meta<typeof CategoricalBarChart> = {
  title: "Charts/CategoricalBarChart",
  component: CategoricalBarChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data: Apple product sales by quarter
const appleSalesData: CategoricalDataItem[] = [
  {group: "Q1'18", category: "iPhone", value: 140},
  {group: "Q1'18", category: "Mac", value: 16},
  {group: "Q1'18", category: "iPad", value: 14},
  {group: "Q1'18", category: "Wearables", value: 12},
  {group: "Q1'18", category: "Services", value: 18},

  {group: "Q2'18", category: "iPhone", value: 125},
  {group: "Q2'18", category: "Mac", value: 19},
  {group: "Q2'18", category: "iPad", value: 15},
  {group: "Q2'18", category: "Wearables", value: 13},
  {group: "Q2'18", category: "Services", value: 28},

  {group: "Q3'18", category: "iPhone", value: 112},
  {group: "Q3'18", category: "Mac", value: 20},
  {group: "Q3'18", category: "iPad", value: 17},
  {group: "Q3'18", category: "Wearables", value: 15},
  {group: "Q3'18", category: "Services", value: 35},

  {group: "Q4'18", category: "iPhone", value: 120},
  {group: "Q4'18", category: "Mac", value: 23},
  {group: "Q4'18", category: "iPad", value: 14},
  {group: "Q4'18", category: "Wearables", value: 14},
  {group: "Q4'18", category: "Services", value: 35},
];

export const Default: Story = {
  args: {
    data: appleSalesData,
    yLabel: "Revenue ($B)",
    yDomain: [0, 150],
  },
};

export const DarkMode: Story = {
  args: {
    data: appleSalesData,
    yLabel: "Revenue ($B)",
    yDomain: [0, 150],
    darkMode: true,
    title: "Apple Product Sales by Quarter",
  },
  parameters: {
    backgrounds: {default: "dark"},
  },
};

export const WithTitle: Story = {
  args: {
    data: appleSalesData,
    title: "Apple Product Sales (2018)",
    yLabel: "Revenue ($B)",
    yDomain: [0, 150],
  },
};

export const CustomColors: Story = {
  args: {
    data: appleSalesData,
    yLabel: "Revenue ($B)",
    yDomain: [0, 150],
    colors: {
      iPhone: "#FF6B6B",
      Mac: "#4ECDC4",
      iPad: "#45B7D1",
      Wearables: "#FFA07A",
      Services: "#98D8C8",
    },
  },
};

export const NoLegend: Story = {
  args: {
    data: appleSalesData,
    yLabel: "Revenue ($B)",
    yDomain: [0, 150],
    legend: false,
  },
};

export const CustomFormatting: Story = {
  args: {
    data: appleSalesData,
    yLabel: "Revenue (Billions)",
    yDomain: [0, 150],
    yTickFormat: (d) => `$${d}B`,
    inset: 0.3,
    facetPadding: 0.2,
  },
};
