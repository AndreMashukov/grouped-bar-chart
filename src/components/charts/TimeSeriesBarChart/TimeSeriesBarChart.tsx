import React, {useEffect, useRef} from "react";
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
const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day

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
  barWidthDays = 12,
  barGapDays = 0,
  title,
  offsetLeft = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate inner dimensions
    // innerWidth is the full chart area width (bars can use from offsetLeft to innerWidth)
    const innerWidth = finalWidth - marginLeft - marginRight;
    const innerHeight = finalHeight - marginTop - marginBottom;

    // Extract unique categories
    const categories = Array.from(new Set(data.map(d => d.category)));

    // Calculate x1/x2 positions for each bar
    interface RectDataItem extends TimeSeriesDataItem {
      x1: Date;
      x2: Date;
    }

    const rectData: RectDataItem[] = data.map((d) => {
      const categoryIndex = categories.indexOf(d.category);
      const totalCategories = categories.length;

      // Convert days to milliseconds
      const barWidthMs = barWidthDays * MS_PER_DAY;
      const barGapMs = barGapDays * MS_PER_DAY;

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

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .style("background", darkMode ? "#2C3142" : "#FFFFFF");

    // Create main group with margins (Y-axis will be at marginLeft)
    const g = svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    // X scale (time scale) - starts at offsetLeft to create gap between Y-axis and first bar
    const allDates = rectData.flatMap(d => [d.x1, d.x2]);
    const xScale = d3.scaleTime()
      .domain(d3.extent(allDates) as [Date, Date])
      .range([offsetLeft, innerWidth]);

    // Y scale
    const yMax = yDomain ? yDomain[1] : (d3.max(data, d => d.value) || 0);
    const yMin = yDomain ? yDomain[0] : 0;
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0])
      .nice();

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(categories.map(cat => colors[cat] || "#999999"));

    // Draw grid (horizontal lines)
    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", darkMode ? "#404552" : "#D3D3D3")
      .attr("stroke-dasharray", "3,3");

    // Remove grid domain line
    g.select(".grid .domain").remove();

    // Get unique dates for X-axis labels (center of each group)
    const uniqueDates = Array.from(new Set(data.map(d => d.date.getTime())))
      .map(time => new Date(time))
      .sort((a, b) => a.getTime() - b.getTime());

    // Draw X-axis line only (no ticks)
    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`);

    // Add axis line
    xAxisGroup.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("stroke", darkMode ? "#E0E0E0" : "#666");

    // Calculate center position for each date group and add labels
    const defaultXTickFormat = d3.utcFormat("%b-%y");
    const formatFn = xTickFormat || defaultXTickFormat;

    uniqueDates.forEach(date => {
      // Find the bars for this date to calculate center
      const barsForDate = rectData.filter(d => d.date.getTime() === date.getTime());
      if (barsForDate.length === 0) return;

      // Get the leftmost x1 and rightmost x2 of the group
      const groupX1 = Math.min(...barsForDate.map(d => xScale(d.x1)));
      const groupX2 = Math.max(...barsForDate.map(d => xScale(d.x2)));
      const centerX = (groupX1 + groupX2) / 2;

      // Add label at center (no tick mark)
      xAxisGroup.append("text")
        .attr("x", centerX)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "12px")
        .text(formatFn(date));
    });

    // Draw Y-axis
    const yAxis = yTickFormat
      ? d3.axisLeft(yScale).tickFormat(yTickFormat as any)
      : d3.axisLeft(yScale);

    const yAxisGroup = g.append("g")
      .call(yAxis);

    yAxisGroup.selectAll("line, path")
      .attr("stroke", darkMode ? "#E0E0E0" : "#666");

    yAxisGroup.selectAll("text")
      .attr("fill", darkMode ? "#E0E0E0" : "#333");

    // Add Y-axis label
    if (yLabel !== undefined && yLabel !== null) {
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -finalHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "14px")
        .text(yLabel);
    }

    // Add X-axis label
    if (xLabel !== undefined && xLabel !== null) {
      svg.append("text")
        .attr("x", finalWidth / 2)
        .attr("y", finalHeight - 5)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "14px")
        .text(xLabel);
    }

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip-timeseries")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", darkMode ? "#2C3142" : "#fff")
      .style("color", darkMode ? "#E0E0E0" : "#333")
      .style("border", `1px solid ${darkMode ? "#404552" : "#ddd"}`)
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Draw bars
    g.selectAll(".bar")
      .data(rectData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x1))
      .attr("y", d => yScale(d.value))
      .attr("width", d => xScale(d.x2) - xScale(d.x1))
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", d => colorScale(d.category))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const dateStr = xTickFormat 
          ? xTickFormat(d.date) 
          : d3.utcFormat("%b %Y")(d.date);
        const valueStr = yTickFormat ? yTickFormat(d.value) : d.value;
        
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${dateStr}</strong><br/>
            ${d.category}: ${valueStr}
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      });

    // Draw baseline
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", darkMode ? "#E0E0E0" : "#666")
      .attr("stroke-width", 1);

    // Draw legend
    if (legend) {
      const legendGroup = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${finalWidth - 120}, 20)`);

      const legendItems = legendGroup.selectAll(".legend-item")
        .data(categories)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_, i) => `translate(0, ${i * 20})`);

      legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));

      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "12px")
        .text(d => d);
    }

    // Cleanup
    return () => {
      d3.selectAll(".d3-tooltip-timeseries").remove();
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
    barWidthDays,
    barGapDays,
    offsetLeft,
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
      <svg ref={svgRef} />
    </Box>
  );
};

export default TimeSeriesBarChart;
