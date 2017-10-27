const fetchGrossData = () => fetch(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
	.then(res => res.json())
	.catch(alert);


async function startApp() {
	const grossData = await fetchGrossData();
	const grossValueScale = d3.scaleLinear()
		.domain([0, d3.max(grossData.data.map(grossEntry => grossEntry[1]))])
		.range([0, 100])

	d3.select('.chart')
		.selectAll('div')
		.data(grossData.data)
			.enter()
			.append('div')
			.classed('chart-data', true)
			.style('height', dataEntry => `${grossValueScale(dataEntry[1])}%`)
}

window.onload = startApp;
