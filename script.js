const fetchGrossData = () => fetch(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
	.then(res => res.json())
	.catch(alert);
const getTooltipHTML = (date, value) => (
	`<strong>${value} Billion $</strong><br />${date}`
);
async function startApp() {
	const margin = {top: 10, left: 10, bottom: 20, right: 30};
	const viewBoxWidth = 1000;
	const viewBoxHeight = 400;
	const width = viewBoxWidth - margin.left - margin.right;
	const height = viewBoxHeight - margin.top - margin.bottom;
	const yScale = d3.scaleLinear().range([height, 0]);
	const xScale = d3.scaleBand().range([0, width]);
	const chart = d3.select('.chart')
		.attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	const tooltip = d3.select('.tooltip');
	const svgContainerNode = d3.select('.svg-container').node();
	const grossData = await fetchGrossData();

	yScale.domain([0, d3.max(grossData.data, ([date, value]) => value)]);
	xScale.domain(grossData.data.map(([date]) => date));
	
	const xAxis = d3.axisBottom()
		.scale(xScale)
		.tickValues(grossData.data
			.filter((val, index) => index % 20 === 0)
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
		.attr('height', ([date, value]) => height - yScale(value))
		.on('mousemove', ([date, value]) => {
			const [left, top] = d3.mouse(svgContainerNode).map(val => `${val}px`);
			
			tooltip.classed('tooltip-hidden', false)
				.html(getTooltipHTML(date, value))
				.style('left', left)
				.style('top', top);
		}).on('mouseout', () => tooltip.classed('tooltip-hidden', true));
	
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
