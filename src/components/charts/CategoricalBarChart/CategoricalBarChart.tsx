import React, {useEffect, useRef, useMemo, useCallback} from "react";
import * as d3 from "d3";
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
  xLabelStyle,
  yLabel,
  yLabelStyle,
  darkMode = false,
  yDomain,
  marginLeft = 60,
  marginBottom = 80,
  marginTop = 20,
  marginRight = 20,
  numberOfTicks = 5,
  yTickFormat,
  barPadding = 0.1,
  groupPadding = 0.2,
  showXAxisLine = true,
  showYAxisLine = true,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> | null>(null);

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

  // Memoize extracted groups and categories
  const groups = useMemo(() => 
    Array.from(new Set(data.map(d => d.group))),
    [data]
  );

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

  // Memoize scales
  const xScale = useMemo(() => {
    return d3.scaleBand()
      .domain(groups)
      .range([0, dimensions.innerWidth])
      .padding(groupPadding);
  }, [groups, dimensions.innerWidth, groupPadding]);

  const xSubScale = useMemo(() => {
    return d3.scaleBand()
      .domain(categories)
      .range([0, xScale.bandwidth()])
      .padding(barPadding);
  }, [categories, xScale, barPadding]);

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

  // Memoized tooltip handlers
  const handleMouseOver = useCallback(function(
    this: SVGRectElement,
    _event: MouseEvent,
    d: CategoricalDataItem
  ) {
    d3.select(this).attr("opacity", 0.8);
    
    const valueStr = yTickFormat ? yTickFormat(d.value) : d.value;
    
    if (tooltipRef.current) {
      tooltipRef.current
        .style("visibility", "visible")
        .html(`
          <strong>${d.group}</strong><br/>
          ${d.category}: ${valueStr}
        `);
    }
  }, [yTickFormat]);

  const handleMouseMove = useCallback(function(event: MouseEvent) {
    if (tooltipRef.current) {
      tooltipRef.current
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    }
  }, []);

  const handleMouseOut = useCallback(function(this: SVGRectElement) {
    d3.select(this).attr("opacity", 1);
    if (tooltipRef.current) {
      tooltipRef.current.style("visibility", "hidden");
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Set SVG attributes
    svg
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .style("background", darkMode ? "#2C3142" : "#FFFFFF");

    const { innerWidth, innerHeight, xTickLabelSpace } = dimensions;

    // Create main group with margins
    const g = svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    // Draw grid (horizontal lines)
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

    // Draw X-axis
    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`);

    // Add axis line (conditionally)
    if (showXAxisLine) {
      xAxisGroup.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("stroke", darkMode ? "#E0E0E0" : "#666")
        .style("shape-rendering", "crispEdges");
    }

    // Add X-axis tick labels (group names)
    groups.forEach(group => {
      const xPos = (xScale(group) || 0) + xScale.bandwidth() / 2;
      
      xAxisGroup.append("text")
        .attr("x", xPos)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("fill", darkMode ? "#E0E0E0" : "#333")
        .style("font-size", "12px")
        .text(group);
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
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          if (key === 'fill' || key === 'stroke') {
            xLabelElement.attr(key, value as string);
          } else {
            xLabelElement.style(cssKey, value as string);
          }
        });
      }
    }

    // Create tooltip
    d3.selectAll(".d3-tooltip-categorical").remove();
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip-categorical")
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
    
    tooltipRef.current = tooltip;

    // Draw bars using join() for efficient updates
    g.selectAll<SVGRectElement, CategoricalDataItem>(".bar")
      .data(data, d => `${d.group}-${d.category}`)
      .join(
        enter => enter.append("rect")
          .attr("class", "bar")
          .attr("x", d => (xScale(d.group) || 0) + (xSubScale(d.category) || 0))
          .attr("y", innerHeight)
          .attr("width", xSubScale.bandwidth())
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
            .attr("x", d => (xScale(d.group) || 0) + (xSubScale(d.category) || 0))
            .attr("y", d => yScale(d.value))
            .attr("width", xSubScale.bandwidth())
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

    // Draw baseline (conditionally)
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
      d3.selectAll(".d3-tooltip-categorical").remove();
    };
  }, [
    data,
    xScale,
    xSubScale,
    yScale,
    colorScale,
    groups,
    categories,
    dimensions,
    finalWidth,
    finalHeight,
    marginLeft,
    marginTop,
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
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
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
      <svg ref={svgRef} />
    </Box>
  );
};

export default CategoricalBarChart;
