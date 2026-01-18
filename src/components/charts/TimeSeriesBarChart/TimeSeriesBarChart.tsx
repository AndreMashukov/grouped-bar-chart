import React, {useEffect, useRef} from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {TimeSeriesBarChartProps, TimeSeriesDataItem} from "./ITimeSeriesBarChartProps";
import useResponsiveDimensions from "../shared/hooks/useResponsiveDimensions";

const DEFAULT_WIDTH = 1400;
const DEFAULT_HEIGHT = 500;
const DEFAULT_COLORS: Record<string, string> = {
  "Sold CabE": "#A0616A",
  "Total CabE": "#BDB76B",
};

const TimeSeriesBarChart: React.FC<TimeSeriesBarChartProps> = ({
  data,
  width,
  height,
  colors = DEFAULT_COLORS,
  legend = true,
  xLabel,
  yLabel,
  darkMode = false,
  yDomain,
  marginLeft = 60,
  marginBottom = 80,
  marginTop = 20,
  marginRight = 20,
  yTickFormat,
  xTickFormat,
  barWidthMs = 12 * 24 * 60 * 60 * 1000, // 12 days
  barGapMs = 2 * 24 * 60 * 60 * 1000, // 2 days
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  // Use responsive dimensions hook
  const {calculatedDimensions} = useResponsiveDimensions({
    width: typeof width === "number" ? width : undefined,
    height: typeof height === "number" ? height : undefined,
    defaultWidth: DEFAULT_WIDTH,
    defaultHeight: DEFAULT_HEIGHT,
    maxWidth: 1600,
    maxHeight: 800,
  });

  const finalWidth =
    typeof width === "number" ? width : calculatedDimensions.width;
  const finalHeight =
    typeof height === "number" ? height : calculatedDimensions.height;

  useEffect(() => {
    if (!plotRef.current || !data || data.length === 0) return;

    // Clear previous plot
    plotRef.current.innerHTML = "";

    // Extract unique categories
    const categories = Array.from(
      new Set(data.map((d) => d.category))
    );

    // Calculate x1/x2 positions for each bar
    const rectData = data.map((d) => {
      const categoryIndex = categories.indexOf(d.category);
      const totalCategories = categories.length;

      // Center the group of bars, then offset each bar
      const groupOffset =
        ((totalCategories - 1) * (barWidthMs + barGapMs)) / 2;
      const barOffset =
        categoryIndex * (barWidthMs + barGapMs) - groupOffset;

      return {
        ...d,
        x1: new Date(d.date.getTime() + barOffset),
        x2: new Date(d.date.getTime() + barOffset + barWidthMs),
      };
    });

    const plot = Plot.plot({
      width: finalWidth,
      height: finalHeight,
      marginLeft,
      marginBottom,
      marginTop,
      marginRight,

      style: {
        background: darkMode ? "#2C3142" : "#FFFFFF",
        color: darkMode ? "#E0E0E0" : "#333333",
      },

      // X-axis (temporal)
      x: {
        type: "utc",
        label: xLabel !== undefined ? xLabel : null,
        tickFormat: xTickFormat || d3.utcFormat("%b-%y"),
      },

      // Y-axis
      y: {
        grid: true,
        gridStroke: darkMode ? "#404552" : "#D3D3D3",
        gridStrokeDasharray: "3,3", // Dotted grid lines
        label: yLabel !== undefined ? yLabel : null,
        domain: yDomain,
        tickFormat: yTickFormat,
      },

      // Color scale
      color: {
        domain: categories,
        range: categories.map((cat) => colors[cat] || "#999999"),
        legend,
      },

      marks: [
        // Use rectY with explicit x1/x2 for temporal scale compatibility
        Plot.rectY(rectData, {
          x1: "x1",
          x2: "x2",
          y: "value",
          fill: "category",
          tip: {
            format: {
              x1: (d: Date) =>
                xTickFormat ? xTickFormat(d) : d3.utcFormat("%b %Y")(d),
              x2: false,
              y: yTickFormat,
            },
          },
        }),

        // Baseline
        Plot.ruleY([0], {
          stroke: darkMode ? "#E0E0E0" : "#666",
          strokeWidth: 1,
        }),
      ],
    });

    plotRef.current.append(plot);

    // Cleanup
    return () => {
      if (plot) plot.remove();
    };
  }, [
    data,
    finalWidth,
    finalHeight,
    colors,
    legend,
    xLabel,
    yLabel,
    darkMode,
    yDomain,
    marginLeft,
    marginBottom,
    marginTop,
    marginRight,
    yTickFormat,
    xTickFormat,
    barWidthMs,
    barGapMs,
  ]);

  return (
    <Box
      ref={containerRef}
      data-testid="time-series-bar-chart"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: darkMode ? "#E0E0E0" : "#333333",
          }}
        >
          {title}
        </Typography>
      )}
      <div ref={plotRef} />
    </Box>
  );
};

export default TimeSeriesBarChart;
