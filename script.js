const fetchGrossData = () => fetch(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
	.then(res => res.json())
	.catch(alert);


async function startApp() {
	const chart = d3.select('.chart');
	const margin = {top: 30, right: 0, bottom: 0, left: 30};
	const width = parseInt(chart.style('width'), 10) - margin.left - margin.right;
	const height = parseInt(chart.style('height'), 10) - margin.top - margin.bottom;
	const yScale = d3.scaleLinear().range([height, 0]);
	const xScale = d3.scaleBand().range([0, width]);
	const grossData = await fetchGrossData();

	yScale.domain([0, d3.max(grossData.data, ([date, value]) => value)]);
	xScale.domain(grossData.data.map(([date]) => date));
	
	const xAxis = d3.axisBottom()
		.scale(xScale)
		.tickValues(grossData.data
			.filter((val, index) => index !== 0 && index % 20 === 0)
			.map(([date]) => date)
		).tickFormat(date => date.split('-')[0]);
	const yAxis = d3.axisRight()
		.scale(yScale)
		.ticks(10)
		.tickFormat(value => value === 0 ? 0 : `${value / 1000}T`);
	const bar = chart.selectAll('g')
		.data(grossData.data)
		.enter()
			.append('g')
			.attr('transform', ([date, value]) => `translate(${xScale(date)}, ${yScale(value)})`);
	
	bar.append('rect')
		.attr('width', xScale.bandwidth())
		.attr('height', ([date, value]) => height - yScale(value));
	
	chart.append('g')
		.attr('transform', `translate(0, ${height})`)
		.classed('axis', true)
		.call(xAxis)
	
	chart.append('g')
		.attr('transform', `translate(${width}, 0)`)
		.classed('axis', true)		
		.call(yAxis)
		.selectAll('text')
		.attr('y', 3)
}

window.onload = startApp;
