import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ArrayVisualizer = ({ array, highlightedIndices }) => {
  const ref = useRef();
  const svgWidth = window.innerWidth * 0.8;
  const svgHeight = window.innerHeight * 0.7;
  const arrayLength = array.length;

  // draw bars
  useEffect(() => {
    const svg = d3.select(ref.current);
    const xScale = d3.scaleLinear().domain([0, arrayLength]).range([0, svgWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([0, svgHeight]); // change the domain to [0, 1]

    svg.selectAll('rect')
      .data(array)
      .join(
        enter => enter.append('rect'),
        update => update,
        exit => exit.remove()
      )
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => svgHeight - yScale(d))
      .attr('width', xScale(1) - 1)
      .attr('height', yScale)
      .attr('fill', (d, i) => highlightedIndices.includes(i) ? 'red' : 'steelblue');
  }, [array, arrayLength, svgWidth, svgHeight]);

  return <svg ref={ref} style={{ width: svgWidth, height: svgHeight }} />;
};

export default ArrayVisualizer;
