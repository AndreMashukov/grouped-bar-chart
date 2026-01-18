import React, {useEffect, useRef} from "react";
import * as Plot from "@observablehq/plot";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CategoricalBarChartProps, CategoricalDataItem} from "./ICategoricalBarChartProps";
import useResponsiveDimensions from "../shared/hooks/useResponsiveDimensions";

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 500;
const DEFAULT_COLORS: Record<string, string> = {
  iPhone: "#5B9BD5",
  Mac: "#ED7D31",
  iPad: "#70AD47",
  Wearables: "#5DADE2",
  Services: "#FFC000",
};

const CategoricalBarChart: React.FC<CategoricalBarChartProps> = ({
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
  inset = 0.2,
  facetPadding = 0.15,
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

    // Extract unique categories and groups for domain
    const categories = Array.from(
      new Set(data.map((d) => d.category))
    );
    const groups = Array.from(new Set(data.map((d) => d.group)));

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

      // Faceting by group (horizontal)
      fx: {
        label: xLabel !== undefined ? xLabel : null,
        padding: facetPadding,
        tickSize: 0,
        domain: groups,
      },

      // X-axis (categories within each group)
      x: {
        label: null,
        padding: 0.2,
        domain: categories,
      },

      // Y-axis
      y: {
        grid: true,
        gridStroke: darkMode ? "#404552" : "#E0E0E0",
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
        // Bars grouped by category within each group facet
        Plot.barY(data, {
          fx: "group", // Facet horizontally by group
          x: "category", // Group by category within facet
          y: "value", // Bar height
          fill: "category", // Color by category
          inset, // Space between bars
          tip: true, // Enable tooltips on hover
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
    inset,
    facetPadding,
  ]);

  return (
    <Box
      ref={containerRef}
      data-testid="categorical-bar-chart"
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

export default CategoricalBarChart;
