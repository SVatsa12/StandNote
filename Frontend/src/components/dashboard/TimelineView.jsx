import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// The component is now simplified to use the `startTime` Date object directly.
const TimelineView = ({
  meetings = [],
  onMeetingHover,
  onMeetingClick,
  onMouseOut,
}) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 150 });
  const [currentZoomState, setCurrentZoomState] = useState();

  // Effect to observe the container's size and set dimensions
  useEffect(() => {
    if (!wrapperRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: 150 });
      }
    });
    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Main D3 drawing effect
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || meetings.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const margin = { top: 20, right: 40, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // --- THIS IS THE CORRECTED LOGIC ---
    // We can now use `d.startTime` directly because it's already a Date object.
    const minDate = d3.min(meetings, d => d.startTime);
    const maxDate = d3.max(meetings, d => d.startTime);
    // Add some padding to the domain
    const initialDomain = [d3.timeDay.offset(minDate, -2), d3.timeDay.offset(maxDate, 2)];
    
    let xScale = d3.scaleTime().domain(initialDomain).range([0, innerWidth]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale = newXScale; // Update the scale with the zoom state
    }

    const chartG = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const pointsG = chartG.append("g");
    const xAxisG = chartG.append("g").attr("transform", `translate(0, ${innerHeight})`);

    const createClusters = (meetings, scale) => {
      const pixelThreshold = 25;
      // Also use `startTime` directly for sorting
      const sortedMeetings = [...meetings].sort((a, b) => a.startTime - b.startTime);
      if (sortedMeetings.length === 0) return [];
      const clusters = [];
      let currentCluster = [sortedMeetings[0]];
      for (let i = 1; i < sortedMeetings.length; i++) {
        const meeting = sortedMeetings[i];
        const lastInCluster = currentCluster[currentCluster.length - 1];
        // And here for comparison
        if (scale(meeting.startTime) - scale(lastInCluster.startTime) < pixelThreshold) {
          currentCluster.push(meeting);
        } else {
          clusters.push(currentCluster);
          currentCluster = [meeting];
        }
      }
      clusters.push(currentCluster);
      return clusters;
    };

    const clusteredData = createClusters(meetings, xScale);

    // Draw points/clusters
    pointsG.selectAll("g.cluster-group")
      .data(clusteredData, d => d.map(m => m.id).join('-'))
      .enter()
      .append("g")
      .attr("class", "cluster-group")
      // And finally, here for positioning
      .attr("transform", d => `translate(${xScale(d[0].startTime)}, ${innerHeight / 2})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onMeetingClick(d[0]))
      .on("mouseover", (event, d) => onMeetingHover(event, d.length > 1 ? { title: `${d.length} meetings` } : d[0]))
      .on("mouseout", onMouseOut)
      .append("circle")
      .attr("r", d => d.length > 1 ? 12 : 8)
      .attr("fill", d => d.length > 1 ? '#845ec2' : '#4f46e5');
      
    // Draw X-axis
    const xAxis = d3.axisBottom(xScale);
    xAxisG.call(xAxis).selectAll("text").style("text-anchor", "end").attr("transform", "rotate(-45)");

    // D3 Zoom handling
    const handleZoom = (event) => {
      setCurrentZoomState(event.transform);
    };
    const zoomBehavior = d3.zoom().on("zoom", handleZoom);
    svg.call(zoomBehavior);

  }, [meetings, dimensions, currentZoomState, onMeetingHover, onMeetingClick, onMouseOut]);

  return (
    <div ref={wrapperRef} className="timeline-wrapper">
      <svg ref={svgRef} className="timeline-svg" />
      <div className="timeline-line"></div>
    </div>
  );
};

export default TimelineView;
