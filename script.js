const fetchGrossData = () => fetch(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
	.then(res => res.json())
	.catch(alert);


async function startApp() {
	const grossData = await fetchGrossData();
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(grossData.data, ([date, value]) => value)])
	const xScale = d3.scaleBand()
		.domain(grossData.data.map(([date]) => date))
		.range([0, 1])
	const formatter = d3.format(".2%");

	d3.select('.chart')
		.selectAll('rect')
		.data(grossData.data)
			.enter()
			.append('rect')
			.attr('width', formatter(xScale.bandwidth()))
			.attr('height', ([date, value]) => formatter(yScale(value)))
			.attr('x', ([date]) => formatter(xScale(date)))
			.attr('y', ([date, value]) => formatter(1 - yScale(value)))
}

window.onload = startApp;
