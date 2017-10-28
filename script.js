const fetchGrossData = () => fetch(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
	.then(res => res.json())
	.catch(alert);


async function startApp() {
	const grossData = await fetchGrossData();
	const grossBarHeight = 100 / grossData.data.length;
	const grossBarHeightPercentage = `${grossBarHeight}%`;
	const grossValueScale = d3.scaleLinear()
		.domain([0, d3.max(grossData.data, ([date, value]) => value)])
		.range([0, 100])

	d3.select('.chart')
		.selectAll('rect')
		.data(grossData.data)
			.enter()
			.append('rect')
			.attr('width', ([date, value]) => `${grossValueScale(value)}%`)
			.attr('height', grossBarHeightPercentage)
			.attr('y', (entry, index) => `${index * grossBarHeight}%`)
}

window.onload = startApp;
