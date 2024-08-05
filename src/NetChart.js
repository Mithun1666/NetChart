import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css'; // Make sure to include the styles for the font family

const NetChart = () => {
  const [activeChart, setActiveChart] = useState('INR');
  const svgRef = useRef();

  const width = 900;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 60, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const rawData = [
    { company: 'Welcom Digital India', role: 'Software Developer', city: 'Navi Mumbai', salaryUSD: 14458, salaryINR: 1201459.8, experience: 3.5, education: 'Rajiv Gandhi Institute of Technology, Mumbai' },
    { company: 'Cognizant', role: 'Software Developer', city: 'Pune', salaryUSD: 12651, salaryINR: 1051298.1, experience: 4.5, education: 'North Maharashtra University (NMU)' },
    { company: 'Barclays', role: 'Software Developer', city: 'Pune', salaryUSD: 16867, salaryINR: 1401647.7, experience: 3.42, education: 'CDAC, Pune' },
    { company: 'Deloitte India', role: 'Software Developer', city: 'Greater Noida', salaryUSD: 15663, salaryINR: 1301595.3, experience: 4, education: 'AKTU' },
    { company: 'Atidan Technologies', role: 'Software Developer', city: 'Hyderabad', salaryUSD: 13253, salaryINR: 1101324.3, experience: 4, education: 'Jawaharlal Nehru Technological University (JNTU)' },
    { company: 'Koenig Solutions', role: 'Software Developer', city: 'Ghazipur', salaryUSD: 18072, salaryINR: 1501783.2, experience: 3.83, education: 'Kamla Nehru Institute of Technology, Sultanpur' },
    { company: 'Wipro', role: 'Software Developer', city: 'Hyderabad', salaryUSD: 12048, salaryINR: 1001188.8, experience: 3.33, education: 'Osmania University' },
    { company: 'Deloitte', role: 'Software Developer', city: 'Hyderabad', salaryUSD: 16867, salaryINR: 1401647.7, experience: 4.25, education: 'Andhra University' },
    { company: 'IBM', role: 'Software Developer', city: 'Pune', salaryUSD: 12048, salaryINR: 1001188.8, experience: 4.25, education: 'Sunbeam Institute (CDAC)' },
    { company: 'Cognizant', role: 'Application Developer', city: 'Bengaluru', salaryUSD: 14819, salaryINR: 1231458.9, experience: 4.92, education: 'Annamacharya Institute of Technology & Science, Kadapa' },
    { company: 'Tata Consultancy Services (TCS)', role: 'Application Developer', city: 'Bengaluru', salaryUSD: 15663, salaryINR: 1301595.3, experience: 4.25, education: 'BVB College of Engineering and Technology, Hubli' }
  ];

  useEffect(() => {
    if (rawData.length === 0) return;

    // Set up SVG and scales
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([3, 5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(activeChart === 'INR' ? [0, 2250000] : [0, 25000])
      .range([innerHeight, 0]);

    // X-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues([ 3,3.25, 3.5,3.75, 4,4.25, 4.5,4.75, 5]));

    xAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('font-family', 'Onest')
      .attr('font-size', '16px')
      .text('Years of Experience');

    // Y-axis
    const yAxis = g.append('g')
      .call(activeChart === 'INR' 
        ? d3.axisLeft(yScale).tickValues([0,250000, 500000,750000, 1000000,1250000, 1500000,1750000, 2000000, 2250000])
        : d3.axisLeft(yScale).tickValues([0, 5000,10000,15000, 20000, 25000]));

    yAxis.selectAll("text")
      .attr('font-size', '12px')
      .attr('font-family', 'Onest');

    yAxis.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 0)
      .attr('x', -innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(`Current Salary (${activeChart})`);

    const make_x_gridlines = () => d3.axisBottom(xScale).ticks(10);
    const make_y_gridlines = () => d3.axisLeft(yScale).ticks(10);

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(make_x_gridlines()
        .tickSize(-innerHeight)
        .tickFormat("")
      );

    g.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-innerWidth)
        .tickFormat("")
      );

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Onest")
      .style("text-align", "left"); 

    const circles = g.selectAll('circle')
      .data(rawData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.experience))
      .attr('cy', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD))
      .attr('r', 5)
      .attr('fill', '#005dff')
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Company: ${d.company}<br/>
                      Role: ${d.role}<br/>
                      City: ${d.city}<br/>
                      Experience: ${d.experience} years<br/>
                      Salary (${activeChart}): ${activeChart === 'INR' ? d.salaryINR.toLocaleString() : d.salaryUSD.toLocaleString()}<br/>
                      Education: ${d.education}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    g.selectAll('text.company')
      .data(rawData)
      .enter()
      .append('text')
      .attr('class', 'company')
      .attr('x', d => xScale(d.experience))
      .attr('y', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('font-size', '12px')
      .attr('fill', '#005dff')
      .text(d => d.company);

  }, [activeChart, rawData]);

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 2px',
    border: '2px solid #000',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    fontFamily: 'Onest'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'blue',
    color: 'white',
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className="App" style={{ fontFamily: 'Onest', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', paddingRight: '180px', paddingTop: '10px' }}>
        <button 
          style={activeChart === 'INR' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('INR')}
        >
          INR
        </button>
        <button 
          style={activeChart === 'USD' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('USD')}
        >
          USD
        </button>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default NetChart;