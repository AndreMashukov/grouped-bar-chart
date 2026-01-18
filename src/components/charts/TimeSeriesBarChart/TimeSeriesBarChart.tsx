import React, {useEffect, useRef, useMemo, useCallback} from "react";
import * as d3 from "d3";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {TimeSeriesBarChartProps, TimeSeriesDataItem} from "./ITimeSeriesBarChartProps";
import useResponsiveDimensions from "../shared/hooks/useResponsiveDimensions";
import FlexibleTooltip, {TooltipDataPoint} from "../shared/FlexibleTooltip";

const DEFAULT_WIDTH = 1400;
const DEFAULT_HEIGHT = 500;
const DEFAULT_COLORS: Record<string, string> = {
  "Sold CabE": "#A0616A",
  "Total CabE": "#BDB76B",
};
const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day

// Memoized data item interface for processed bar data
interface RectDataItem extends TimeSeriesDataItem {
  x1: Date;
  x2: Date;
}

const TimeSeriesBarChart: React.FC<TimeSeriesBarChartProps> = ({
  data,
  width,
  height,
  colors = DEFAULT_COLORS,
  legend = true,
  xLabel,
  xLabelStyle,
  yLabel,
  yLabelStyle,
  darkMode = false,
  yDomain,
  marginLeft = 60,
  marginBottom = 80,
  marginTop = 20,
  marginRight = 20,
  yTickFormat,
  xTickFormat,
  numberOfTicks = 5,
  barWidthDays = 12,
  barGapDays = 0,
  title,
  offsetLeft = 10,
  showXAxisLine = true,
  showYAxisLine = true,
  customTooltipElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipDataRef = useRef<TooltipDataPoint[] | null>(null);
  const mousePositionRef = useRef<{x: number; y: number}>({x: 0, y: 0});
  const containerRectRef = useRef<DOMRect | null>(null);

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

  // Memoize extracted categories for stable reference
  const categories = useMemo(() => 
    Array.from(new Set(data.map(d => d.category))),
    [data]
  );

  // Memoize calculated inner dimensions
  const dimensions = useMemo(() => {
    const xTickLabelSpace = 20;
    const xAxisLabelSpace = xLabel ? 20 : 0;
    const requiredBottomSpace = xTickLabelSpace + xAxisLabelSpace;
    const effectiveMarginBottom = Math.max(marginBottom, requiredBottomSpace);
    
    return {
      innerWidth: finalWidth - marginLeft - marginRight,
      innerHeight: finalHeight - marginTop - effectiveMarginBottom,
      effectiveMarginBottom,
      xTickLabelSpace,
    };
  }, [finalWidth, finalHeight, marginLeft, marginRight, marginTop, marginBottom, xLabel]);

  // Memoize processed bar data with x1/x2 positions
  const rectData = useMemo((): RectDataItem[] => {
    if (!data || data.length === 0) return [];
    
    return data.map((d) => {
      const categoryIndex = categories.indexOf(d.category);
      const totalCategories = categories.length;

      const barWidthMs = barWidthDays * MS_PER_DAY;
      const barGapMs = barGapDays * MS_PER_DAY;

      const groupOffset = ((totalCategories - 1) * (barWidthMs + barGapMs)) / 2;
      const barOffset = categoryIndex * (barWidthMs + barGapMs) - groupOffset;

      return {
        ...d,
        x1: new Date(d.date.getTime() + barOffset),
        x2: new Date(d.date.getTime() + barOffset + barWidthMs),
      };
    });
  }, [data, categories, barWidthDays, barGapDays]);

  // Memoize scales for better performance
  const xScale = useMemo(() => {
    if (rectData.length === 0) return null;
    
    const allDates = rectData.flatMap(d => [d.x1, d.x2]);
    return d3.scaleTime()
      .domain(d3.extent(allDates) as [Date, Date])
      .range([offsetLeft, dimensions.innerWidth]);
  }, [rectData, offsetLeft, dimensions.innerWidth]);

  const yScale = useMemo(() => {
    const yMax = yDomain ? yDomain[1] : (d3.max(data, d => d.value) || 0);
    const yMin = yDomain ? yDomain[0] : 0;
    return d3.scaleLinear()
      .domain([yMin, yMax])
      .range([dimensions.innerHeight, 0])
      .nice();
  }, [data, yDomain, dimensions.innerHeight]);

  const colorScale = useMemo(() => 
    d3.scaleOrdinal<string>()
      .domain(categories)
      .range(categories.map(cat => colors[cat] || "#999999")),
    [categories, colors]
  );

  // Memoize unique dates for X-axis labels
  const uniqueDates = useMemo(() => 
    Array.from(new Set(data.map(d => d.date.getTime())))
      .map(time => new Date(time))
      .sort((a, b) => a.getTime() - b.getTime()),
    [data]
  );

  // Memoize format functions
  const defaultXTickFormat = useMemo(() => d3.utcFormat("%b-%y"), []);
  const formatFn = xTickFormat || defaultXTickFormat;

  // Memoized tooltip handlers for better performance
  const handleMouseOver = useCallback(function(
    this: SVGRectElement,
    event: MouseEvent,
    d: RectDataItem
  ) {
    d3.select(this).attr("opacity", 0.8);
    
    // Update container rect ref for tooltip positioning
    if (containerRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
    
    const valueStr = yTickFormat ? yTickFormat(d.value) : d.value;
    
    // Update tooltip data ref
    tooltipDataRef.current = [{
      label: d.category,
      value: typeof valueStr === 'string' ? parseFloat(valueStr) || d.value : valueStr,
      color: colorScale(d.category),
      category: d.category,
      date: d.date,
    }];
    
    // Update mouse position
    if (containerRef.current) {
      const [x, y] = d3.pointer(event, containerRef.current);
      mousePositionRef.current = {x, y};
    }
  }, [yTickFormat, colorScale]);

  const handleMouseMove = useCallback(function(event: MouseEvent) {
    if (containerRef.current) {
      const [x, y] = d3.pointer(event, containerRef.current);
      mousePositionRef.current = {x, y};
    }
  }, []);

  const handleMouseOut = useCallback(function(this: SVGRectElement) {
    d3.select(this).attr("opacity", 1);
    tooltipDataRef.current = null;
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0 || !xScale) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous content efficiently
    svg.selectAll("*").remove();
    
    // Set SVG attributes
    svg
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .style("background", darkMode ? "#2C3142" : "#FFFFFF");

    const { innerWidth, innerHeight, xTickLabelSpace } = dimensions;

    // Create main group with margins (Y-axis will be at marginLeft)
    const g = svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    // Draw grid (horizontal lines) - use shape-rendering for crisp lines
    // Match grid lines with visible Y-axis ticks
    const gridGroup = g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .ticks(numberOfTicks)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );
    
    gridGroup.selectAll("line")
      .attr("stroke", darkMode ? "#404552" : "#D3D3D3")
      .attr("stroke-dasharray", "3,3")
      .style("shape-rendering", "crispEdges");

    // Remove grid domain line
    gridGroup.select(".domain").remove();

    // Draw X-axis line only (no ticks)
    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`);

    // Add axis line (conditionally) - use shape-rendering for crisp lines
    if (showXAxisLine) {
      xAxisGroup.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("stroke", darkMode ? "#E0E0E0" : "#666")
        .style("shape-rendering", "crispEdges");
    }

    // Calculate center position for each date group and add labels
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
      ? d3.axisLeft(yScale).ticks(numberOfTicks).tickFormat(yTickFormat as any)
      : d3.axisLeft(yScale).ticks(numberOfTicks);

    const yAxisGroup = g.append("g")
      .call(yAxis);

    if (showYAxisLine) {
      yAxisGroup.selectAll("line, path")
        .attr("stroke", darkMode ? "#E0E0E0" : "#666");
    } else {
      yAxisGroup.selectAll("line, path").remove();
    }

    yAxisGroup.selectAll("text")
      .attr("fill", darkMode ? "#E0E0E0" : "#333");

    // Add Y-axis label
    if (yLabel !== undefined && yLabel !== null) {
      const yLabelElement = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -finalHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "14px")
        .text(yLabel);
      
      // Apply custom styles if provided
      if (yLabelStyle) {
        Object.entries(yLabelStyle).forEach(([key, value]) => {
          // Convert camelCase to kebab-case for CSS properties
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          if (key === 'fill' || key === 'stroke') {
            yLabelElement.attr(key, value as string);
          } else {
            yLabelElement.style(cssKey, value as string);
          }
        });
      }
    }

    // Add X-axis label
    if (xLabel !== undefined && xLabel !== null) {
      const xLabelElement = svg.append("text")
        .attr("x", finalWidth / 2)
        .attr("y", marginTop + innerHeight + xTickLabelSpace + 15)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "14px")
        .text(xLabel);
      
      // Apply custom styles if provided
      if (xLabelStyle) {
        Object.entries(xLabelStyle).forEach(([key, value]) => {
          // Convert camelCase to kebab-case for CSS properties
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          if (key === 'fill' || key === 'stroke') {
            xLabelElement.attr(key, value as string);
          } else {
            xLabelElement.style(cssKey, value as string);
          }
        });
      }
    }

    // Draw bars using join() for efficient updates
    g.selectAll<SVGRectElement, RectDataItem>(".bar")
      .data(rectData, d => `${d.date.getTime()}-${d.category}`)
      .join(
        enter => enter.append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d.x1))
          .attr("y", innerHeight)
          .attr("width", d => xScale(d.x2) - xScale(d.x1))
          .attr("height", 0)
          .attr("fill", d => colorScale(d.category))
          .call(enter => enter.transition()
            .duration(300)
            .attr("y", d => yScale(d.value))
            .attr("height", d => innerHeight - yScale(d.value))
          ),
        update => update
          .call(update => update.transition()
            .duration(300)
            .attr("x", d => xScale(d.x1))
            .attr("y", d => yScale(d.value))
            .attr("width", d => xScale(d.x2) - xScale(d.x1))
            .attr("height", d => innerHeight - yScale(d.value))
            .attr("fill", d => colorScale(d.category))
          ),
        exit => exit
          .call(exit => exit.transition()
            .duration(300)
            .attr("y", innerHeight)
            .attr("height", 0)
            .remove()
          )
      )
      .on("mouseover", handleMouseOver as any)
      .on("mousemove", handleMouseMove as any)
      .on("mouseout", handleMouseOut as any);

    // Draw baseline (conditionally) - use shape-rendering for crisp lines
    if (showXAxisLine) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", darkMode ? "#E0E0E0" : "#666")
        .attr("stroke-width", 1)
        .style("shape-rendering", "crispEdges");
    }

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
      tooltipDataRef.current = null;
    };
  }, [
    // Core data dependencies
    rectData,
    xScale,
    yScale,
    colorScale,
    categories,
    uniqueDates,
    dimensions,
    formatFn,
    // Layout dependencies
    finalWidth,
    finalHeight,
    marginLeft,
    marginTop,
    // Style dependencies
    darkMode,
    legend,
    xLabel,
    xLabelStyle,
    yLabel,
    yLabelStyle,
    showXAxisLine,
    showYAxisLine,
    yTickFormat,
    numberOfTicks,
    // Memoized handlers
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
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
      <FlexibleTooltip
        tooltipDataRef={tooltipDataRef}
        mousePositionRef={mousePositionRef}
        containerRectRef={containerRectRef}
        darkMode={darkMode}
        customTooltipElement={customTooltipElement}
      >
        <svg ref={svgRef} />
      </FlexibleTooltip>
    </Box>
  );
};

export default TimeSeriesBarChart;
