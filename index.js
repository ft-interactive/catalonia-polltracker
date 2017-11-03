const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
const chartFrame = require('g-chartframe');
const bertha = require('bertha-client');
const {sortData} = require('./lib/sort-data.js');
const {averageData} = require('./lib/average-data.js');
const { colourSelector, nameCleaner } = require('./lib/helpers.js');
const scatterChart = require('./lib/scatterchart.js').electionScatterChart;
const lineChart = require('./lib/linechart.js').electionLineChart;
const chartAxes = require('./lib/chart-axes.js').electionChartAxes;

const spreadsheetKey = '1k0Om8fwwSnxOolpkGGOjBHlffEeMvQwtVM6gQs_AfYE';

const dateEarliest = new Date("1 October 2016");
const dateLatest = new Date("1 February 2018");
const yAxisMin = 0;
const yAxisMax = 45;
const dir = 'dist';
const timestamp = Date.now();

// CHART CONFIG
const medChartConfig = {
	frameMaker: chartFrame.webFrameM,
	width: 700,
	height: 550,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: 25, top: 145, left: 30, right: 50},
	sourceSizing: {sourcePos: 20},
	title: 'Catalonia polltracker',
  radius: 5,
};
const smallChartConfig = {
	frameMaker: chartFrame.webFrameS,
	width: 300,
	height: 500,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -30, top: 180, left: 20, right: 28},
	sourceSizing: {sourcePos: 25},
	title: 'Catalonia polltracker',
  radius: 3,
};

loadData().then(data =>{
  const sortedData = sortData(data.data);
  const chartM = makeChart(sortedData, medChartConfig);
  const chartS = makeChart(sortedData, smallChartConfig);
  writeChartToFile(chartM, 'medium');
  writeChartToFile(chartS, 'small');
}).catch(err => console.error(`MAKING THE CHART FAILED ${err}`, err));

async function loadData(){
  return bertha.get(spreadsheetKey, ['data'], { republish: true });
};

function makeChart(data, chartConfig) {
  // Create average data
	const lineData = averageData(data);

  console.log("Line data", lineData);

  const {frameMaker, width, height, chartPadding, chartMargin, titleSizing, sourceSizing, title, radius} = chartConfig;
	const dateLastPublished = d3.utcFormat('%H:%M, %b %d %Y')(Date.now() + 3600); //assume UK time is BST, one hour ahead of UTC

  // Set up the virtual dom
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.sendTo(console);

  const dom = new JSDOM(fs.readFileSync('scaffold.html'), {virtualConsole});

  // Get the thing we'll be drawing in
  const chartContainer = d3.select(dom.window.document.querySelector('body div.chart'));

  // Set up frame
  const frame = frameMaker({
    title,
    subtitle: 'Lines represent weighted averages |' +
    'Points represent polls | |' +
    'Voting intention, share by party (%)',
    source: `Source: Catalonia, updated ${dateLastPublished} |` +
    'Graphic: Anna Leach, © FT',
    margin: chartMargin
  });

  // Various amends to make the thing fit on the page
  frame.autoPosition(false);
  frame.sourceY(height - sourceSizing.sourcePos);
  frame.sourceLineHeight(18);

  const chartHeight = frame.dimension().height;
  const chartWidth = frame.dimension().width - chartMargin.left - chartMargin.right;
  const dotOpacity = 0.9;
  const monthsBetweenTicks = 3;
  const timestamp = Date.now();

  // Add scales
  const xScale = d3.scaleLinear()
    .domain([dateEarliest, dateLatest])
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain([yAxisMin, yAxisMax])
    .range([(chartHeight - chartPadding.bottom - chartPadding.top), 0]);

    // Set up svg
	chartContainer.select('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .call(frame);

  // Select chart plot and make the damn thing go down
	const plot = chartContainer.select('.chart-plot');

  // Create chart
	const pollScatterChart = scatterChart(plot);
	pollScatterChart.setRadius(radius);
	pollScatterChart.setXScale(xScale);
	pollScatterChart.setYScale(yScale);
	pollScatterChart.setOpacity(dotOpacity);
	pollScatterChart.setColourSelector(colourSelector);

  // Create axes
	const axes = chartAxes(plot);
	axes.setXScale(xScale);
	axes.setYScale(yScale);
	axes.setHeight(chartHeight);
	axes.setWidth(chartWidth);
	axes.setEarliestDate(dateEarliest);
	axes.setPadding(chartPadding);
	axes.setMonthsBetweenTicks(monthsBetweenTicks);

  // Create line Graph
	const averageLineChart = lineChart(plot);
	averageLineChart.setXScale(xScale);
	averageLineChart.setYScale(yScale);
	averageLineChart.setColourSelector(colourSelector);
	// averageLineChart.setNameCleaner(nameCleaner);

  // Add all to frame
	frame.plot()
    .datum(data.filter(d => {
      // console.log("HERE DATA", d['surveyPublished']);
      return d['surveyPublished'] > dateEarliest;
    }))
    .call(pollScatterChart)
    .call(axes);

	frame.plot()
    .datum(lineData.filter(d => d.date > dateEarliest))
    .call(averageLineChart);

	return chartContainer;

}

function writeChartToFile(chartContainer, size) {
	const doctype = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;
	const markup = doctype + chartContainer.html().trim();

  // Save the resulting SVG
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(`${dir}/catalonia-latest-${size}.svg`, markup);
	fs.writeFileSync(`${dir}/catalonia-${timestamp}-${size}.svg`, markup);
}
