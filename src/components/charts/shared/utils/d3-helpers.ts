import * as d3 from "d3";

/**
 * Create a band scale for categorical data
 */
export function createBandScale(
  domain: string[],
  range: [number, number],
  padding: number = 0.2
): d3.ScaleBand<string> {
  return d3.scaleBand().domain(domain).range(range).padding(padding);
}

/**
 * Create a linear scale for numerical data
 */
export function createLinearScale(
  domain: [number, number],
  range: [number, number]
): d3.ScaleLinear<number, number> {
  return d3.scaleLinear().domain(domain).range(range);
}

/**
 * Create a time scale for temporal data
 */
export function createTimeScale(
  domain: [Date, Date],
  range: [number, number]
): d3.ScaleTime<number, number> {
  return d3.scaleTime().domain(domain).range(range);
}

/**
 * Create an ordinal color scale
 */
export function createColorScale(
  domain: string[],
  colors: Record<string, string>,
  fallbackColor: string = "#999999"
): d3.ScaleOrdinal<string, string> {
  const range = domain.map((key) => colors[key] || fallbackColor);
  return d3.scaleOrdinal<string, string>().domain(domain).range(range);
}

/**
 * Draw X-axis
 */
export function drawXAxis(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<any>,
  height: number,
  label?: string | null,
  tickFormat?: (value: any) => string,
  darkMode: boolean = false
): void {
  const axis = d3.axisBottom(scale);
  
  if (tickFormat) {
    axis.tickFormat(tickFormat as any);
  }

  const axisGroup = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(axis);

  // Style the axis
  axisGroup.selectAll("line, path")
    .attr("stroke", darkMode ? "#E0E0E0" : "#666");

  axisGroup.selectAll("text")
    .attr("fill", darkMode ? "#E0E0E0" : "#333");

  // Add label if provided
  if (label !== undefined && label !== null) {
    svg.append("text")
      .attr("x", scale.range()[1] / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .attr("fill", darkMode ? "#E0E0E0" : "#333")
      .text(label);
  }
}

/**
 * Draw Y-axis
 */
export function drawYAxis(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<any>,
  label?: string | null,
  tickFormat?: (value: any) => string,
  darkMode: boolean = false,
  offsetLeft: number = 0
): void {
  const axis = d3.axisLeft(scale);
  
  if (tickFormat) {
    axis.tickFormat(tickFormat as any);
  }

  const axisGroup = svg.append("g")
    .attr("transform", `translate(${offsetLeft},0)`)
    .call(axis);

  // Style the axis
  axisGroup.selectAll("line, path")
    .attr("stroke", darkMode ? "#E0E0E0" : "#666");

  axisGroup.selectAll("text")
    .attr("fill", darkMode ? "#E0E0E0" : "#333");

  // Add label if provided
  if (label !== undefined && label !== null) {
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -scale.range()[0] / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("fill", darkMode ? "#E0E0E0" : "#333")
      .text(label);
  }
}

/**
 * Draw grid lines
 */
export function drawGrid(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.AxisScale<any>,
  yScale: d3.AxisScale<any>,
  width: number,
  height: number,
  darkMode: boolean = false
): void {
  // Horizontal grid lines
  svg.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => "")
    )
    .selectAll("line")
    .attr("stroke", darkMode ? "#404552" : "#E0E0E0")
    .attr("stroke-dasharray", "3,3");

  // Remove domain line
  svg.select(".grid .domain").remove();
}

/**
 * Create a legend
 */
export function drawLegend(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  categories: string[],
  colorScale: d3.ScaleOrdinal<string, string>,
  width: number,
  darkMode: boolean = false
): void {
  const legendGroup = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, 20)`);

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

/**
 * Add tooltip functionality
 */
export function addTooltip(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  darkMode: boolean = false
): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
  return d3.select("body")
    .append("div")
    .attr("class", "d3-tooltip")
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
}
